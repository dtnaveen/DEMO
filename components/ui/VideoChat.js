'use client';

import { useState, useRef, useEffect } from 'react';
import { VideoCameraIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';

/**
 * VideoChat Component
 * WebRTC-based video chat implementation
 */
export default function VideoChat({ 
  isOpen, 
  onClose, 
  otherUser,
  currentUser 
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      initializeCall();
    } else {
      endCall();
    }

    return () => {
      endCall();
    };
  }, [isOpen]);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      // Note: In production, you'd use a signaling server (WebSocket)
      // For now, this is a simplified implementation
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };

      const peerConnection = new RTCPeerConnection(configuration);

      // Add local stream tracks
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
        setIsConnected(true);
        setConnectionStatus('connected');
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // In production, send to signaling server
          console.log('ICE candidate:', event.candidate);
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        setConnectionStatus(peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
        } else if (peerConnection.connectionState === 'disconnected' || 
                   peerConnection.connectionState === 'failed') {
          setIsConnected(false);
        }
      };

      peerConnectionRef.current = peerConnection;

      // Create offer (in production, exchange via signaling server)
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      // Simulate receiving answer (in production, from signaling server)
      setTimeout(() => {
        setConnectionStatus('connected');
        setIsConnected(true);
      }, 1000);

    } catch (error) {
      console.error('Error initializing call:', error);
      alert('Could not access camera/microphone. Please allow permissions.');
      onClose();
    }
  };

  const endCall = () => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    // Clear video refs
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={endCall} title={`Video Call with ${otherUser?.name || 'User'}`} size="large">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '600px' }}>
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-48 h-64 bg-gray-900 rounded-lg overflow-hidden border-2 border-white">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg font-medium">
                {connectionStatus === 'connecting' ? 'Connecting...' : 'Waiting for connection...'}
              </p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isAudioEnabled 
                  ? 'bg-white text-gray-900' 
                  : 'bg-red-500 text-white'
              }`}
            >
              <PhoneIcon className="w-6 h-6" />
            </button>
            
            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isVideoEnabled 
                  ? 'bg-white text-gray-900' 
                  : 'bg-gray-600 text-white'
              }`}
            >
              <VideoCameraIcon className="w-6 h-6" />
            </button>
            
            <button
              onClick={endCall}
              className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

