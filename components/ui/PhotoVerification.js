'use client';

import { useState, useRef } from 'react';
import { CameraIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import Modal from './Modal';

/**
 * PhotoVerification Component
 * Verifies user identity by matching selfie with profile photos
 */
export default function PhotoVerification({ 
  profilePhotos = [], 
  onVerificationComplete,
  isOpen,
  onClose 
}) {
  const [step, setStep] = useState(1); // 1: Instructions, 2: Capture, 3: Processing, 4: Result
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setStep(2);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please allow camera permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      const photoData = canvas.toDataURL('image/jpeg');
      setCapturedPhoto(photoData);
      
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setStep(3);
      verifyPhoto(photoData);
    }
  };

  const verifyPhoto = async (photoData) => {
    // Simulate verification process
    // In production, this would use face recognition API
    setTimeout(() => {
      // Mock verification - 80% success rate
      const isVerified = Math.random() > 0.2;
      setVerificationResult(isVerified);
      setStep(4);
      
      if (isVerified && onVerificationComplete) {
        onVerificationComplete();
      }
    }, 2000);
  };

  const handleClose = () => {
    // Stop camera if running
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setStep(1);
    setCapturedPhoto(null);
    setVerificationResult(null);
    onClose();
  };

  const retry = () => {
    setStep(1);
    setCapturedPhoto(null);
    setVerificationResult(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Verify Your Photo">
      <div className="space-y-6">
        {step === 1 && (
          <div className="text-center space-y-4">
            <CameraIcon className="w-16 h-16 text-primary-500 mx-auto" />
            <h3 className="text-xl font-bold">Photo Verification</h3>
            <p className="text-gray-600">
              We'll take a quick selfie to verify it's really you. This helps keep VibeMatch safe and authentic.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-sm text-blue-800 font-medium mb-2">Tips for best results:</p>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Make sure your face is clearly visible</li>
                <li>Use good lighting</li>
                <li>Remove sunglasses or masks</li>
                <li>Look directly at the camera</li>
              </ul>
            </div>
            <Button onClick={startCamera} className="w-full">
              Start Verification
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 border-4 border-primary-500 rounded-lg pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-white rounded-lg"></div>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-2">
              <Button onClick={capturePhoto} className="flex-1">
                Capture Photo
              </Button>
              <Button onClick={handleClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <h3 className="text-xl font-bold">Verifying...</h3>
            <p className="text-gray-600">Please wait while we verify your photo</p>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-4">
            {verificationResult ? (
              <>
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold text-green-600">Verification Successful!</h3>
                <p className="text-gray-600">
                  Your photo has been verified. You now have a verified badge on your profile.
                </p>
                <Button onClick={handleClose} className="w-full">
                  Done
                </Button>
              </>
            ) : (
              <>
                <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />
                <h3 className="text-xl font-bold text-red-600">Verification Failed</h3>
                <p className="text-gray-600">
                  We couldn't verify your photo. Please make sure your face is clearly visible and matches your profile photos.
                </p>
                <div className="flex gap-2">
                  <Button onClick={retry} className="flex-1">
                    Try Again
                  </Button>
                  <Button onClick={handleClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

