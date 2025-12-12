'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser, getAllUsers, getConversations, setConversations } from '@/lib/localStorage';
import { getConversationId, formatDate, showToast } from '@/utils/helpers';
import { calculateMatchScore } from '@/lib/matchingAlgorithm';
import { sendAutoMessagesFromSarah } from '@/lib/autoMessaging';
import { checkAndReplyToMessages, setupAIBotAutoReplies, forceImmediateReply } from '@/lib/aiBotReplies';
import { getBotUserId } from '@/lib/botProfile';
import { getOrCreateAIChatBot, getOrCreateAIBotConversation, AI_CHAT_BOT_ID } from '@/lib/aiChatBot';
import { isPremiumUser, hasPremiumFeature } from '@/lib/subscription';
import { LocationSharing } from '@/lib/advancedGPS';
import { uploadVoiceMessage } from '@/lib/api';
import PremiumBadge from '@/components/ui/PremiumBadge';
import AIConversationAssistant from '@/components/ui/AIConversationAssistant';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { Cog6ToothIcon, MapPinIcon, VideoCameraIcon, MicrophoneIcon, FaceSmileIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import IcebreakerPrompts from '@/components/ui/IcebreakerPrompts';
import VideoChat from '@/components/ui/VideoChat';
import SafetyActions from '@/components/ui/SafetyActions';
import VoiceMessage from '@/components/ui/VoiceMessage';
import GifStickerPicker from '@/components/ui/GifStickerPicker';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversationsState] = useState({});
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [isAIBotTyping, setIsAIBotTyping] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showVideoChat, setShowVideoChat] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/onboard');
      return;
    }
    
    setCurrentUser(user);
    
    // Initialize AI chat bot for this user (always available, regardless of matches)
    // Force creation and ensure it's in the users list
    try {
      const aiBot = getOrCreateAIChatBot();
      console.log('AI Bot created/retrieved:', aiBot);
      
      if (aiBot) {
        const conversationId = getOrCreateAIBotConversation();
        console.log('AI Bot conversation ID:', conversationId);
        
        if (conversationId) {
          // Ensure conversation is saved
          const convos = getConversations();
          if (!convos[conversationId]) {
            convos[conversationId] = {
              participants: [user.id, aiBot.id],
              messages: aiBot.welcomeMessage ? [{
                senderId: aiBot.id,
                text: aiBot.welcomeMessage,
                timestamp: new Date().toISOString(),
                isAI: true
              }] : []
            };
            setConversations(convos);
            console.log('AI Bot conversation created with welcome message');
          }
        }
      } else {
        console.error('Failed to create AI bot - getOrCreateAIChatBot returned null');
      }
    } catch (error) {
      console.error('Error initializing AI bot:', error);
    }
    
    // Load conversations
    const convos = getConversations();
    setConversationsState(convos);
    
    // Force refresh to ensure AI bot appears - check after a short delay
    setTimeout(() => {
      const allUsers = getAllUsers();
      const aiBot = allUsers.find(u => u.id === AI_CHAT_BOT_ID && u.ownerId === user.id);
      console.log('AI Bot in users list:', aiBot);
      
      if (!aiBot) {
        console.log('AI Bot not found, attempting to recreate...');
        try {
          const newBot = getOrCreateAIChatBot();
          console.log('Recreated AI Bot:', newBot);
          // Force state update
          const updatedConvos = getConversations();
          setConversationsState(updatedConvos);
        } catch (e) {
          console.error('Error recreating AI bot:', e);
        }
      } else {
        // Bot exists, just refresh conversations
        const updatedConvos = getConversations();
        setConversationsState(updatedConvos);
      }
    }, 100);
    
    // Send auto-messages from Sarah to all users
    setTimeout(() => {
      sendAutoMessagesFromSarah();
      // Reload conversations after auto-message
      const updatedConvos = getConversations();
      setConversationsState(updatedConvos);
    }, 500);
    
    // Setup AI bot auto-replies
    setupAIBotAutoReplies();
    
    // If userId param exists, open that conversation
    if (userId) {
      const conversationId = getConversationId(user.id, userId);
      if (convos[conversationId]) {
        setSelectedConversationId(conversationId);
        const allUsers = getAllUsers();
        const otherUser = allUsers.find(u => u.id === userId);
        setSelectedUser(otherUser);
      } else {
        // New conversation - show icebreaker
        const allUsers = getAllUsers();
        const otherUser = allUsers.find(u => u.id === userId);
        if (otherUser) {
          setSelectedUser(otherUser);
          setShowIcebreaker(true);
        }
      }
    }
  }, [userId, router]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedConversationId]);
  
  // Listen for conversation updates (from AI bot auto-replies)
  useEffect(() => {
    const handleConversationsUpdate = () => {
      const updatedConvos = getConversations();
      setConversationsState(updatedConvos);
    };
    
    window.addEventListener('conversationsUpdated', handleConversationsUpdate);
    
    return () => {
      window.removeEventListener('conversationsUpdated', handleConversationsUpdate);
    };
  }, []);
  
  // Periodic check for AI bot replies
  useEffect(() => {
    const interval = setInterval(() => {
      const repliesSent = checkAndReplyToMessages();
      if (repliesSent > 0) {
        // Refresh conversations if replies were sent
        setTimeout(() => {
          const updatedConvos = getConversations();
          setConversationsState(updatedConvos);
        }, 500);
      }
    }, 5000); // Check every 5 seconds (more frequent)
    
    return () => clearInterval(interval);
  }, []);
  
  const getAllConversationPartners = () => {
    if (!currentUser) return [];
    
    const allUsers = getAllUsers();
    const partners = [];
    
    // Always include AI chat bot (always available, regardless of matches)
    // Force creation if it doesn't exist
    let aiBot = null;
    try {
      aiBot = getOrCreateAIChatBot();
      console.log('getAllConversationPartners - AI Bot:', aiBot);
      
      // If bot not found, try to find it in users list
      if (!aiBot) {
        aiBot = allUsers.find(u => u.id === AI_CHAT_BOT_ID && u.ownerId === currentUser.id);
        console.log('AI Bot found in users list:', aiBot);
      }
    } catch (error) {
      console.error('Error getting AI bot:', error);
      // Try to find existing bot in users list as fallback
      aiBot = allUsers.find(u => u.id === AI_CHAT_BOT_ID && u.ownerId === currentUser.id);
    }
    
    // Always add AI bot, even if conversation doesn't exist yet
    if (aiBot) {
      let aiBotConversationId = null;
      try {
        aiBotConversationId = getOrCreateAIBotConversation();
      } catch (error) {
        console.error('Error getting AI bot conversation:', error);
        // Create conversation ID manually if function fails
        const { getConversationId } = require('@/utils/helpers');
        aiBotConversationId = getConversationId(currentUser.id, aiBot.id);
      }
      
      if (aiBotConversationId) {
        // Get conversation from localStorage (most up-to-date)
        const allConversations = getConversations();
        const aiBotConversation = allConversations[aiBotConversationId];
        const lastMessage = aiBotConversation?.messages && aiBotConversation.messages.length > 0
          ? aiBotConversation.messages[aiBotConversation.messages.length - 1]
          : null;
        
        partners.push({
          user: aiBot,
          conversationId: aiBotConversationId,
          lastMessage,
          matchScore: null, // AI bot doesn't have a match score
          isAIChatBot: true // Flag to identify AI chat bot
        });
        console.log('AI Bot added to partners list');
      } else {
        // Fallback: add AI bot even without conversation ID
        const { getConversationId } = require('@/utils/helpers');
        const fallbackConversationId = getConversationId(currentUser.id, aiBot.id);
        partners.push({
          user: aiBot,
          conversationId: fallbackConversationId,
          lastMessage: null,
          matchScore: null,
          isAIChatBot: true
        });
        console.log('AI Bot added to partners list (fallback)');
      }
    } else {
      console.error('AI Bot is null - cannot add to partners list');
      console.log('All users:', allUsers);
      console.log('Current user:', currentUser);
      // Last resort: try to create bot one more time
      try {
        const lastResortBot = getOrCreateAIChatBot();
        if (lastResortBot) {
          const { getConversationId } = require('@/utils/helpers');
          const fallbackConversationId = getConversationId(currentUser.id, lastResortBot.id);
          partners.push({
            user: lastResortBot,
            conversationId: fallbackConversationId,
            lastMessage: null,
            matchScore: null,
            isAIChatBot: true
          });
          console.log('AI Bot added to partners list (last resort)');
        }
      } catch (e) {
        console.error('Last resort bot creation failed:', e);
      }
    }
    
    // Add other conversation partners
    const allConversations = getConversations();
    Object.keys(allConversations).forEach(conversationId => {
      const conversation = allConversations[conversationId];
      if (conversation && conversation.participants && conversation.participants.includes(currentUser.id)) {
        const otherUserId = conversation.participants.find(id => id !== currentUser.id);
        
        // Skip AI chat bot (already added above)
        if (otherUserId === AI_CHAT_BOT_ID) return;
        
        const otherUser = allUsers.find(u => u.id === otherUserId);
        
        if (otherUser) {
          const lastMessage = conversation.messages && conversation.messages.length > 0
            ? conversation.messages[conversation.messages.length - 1]
            : null;
          const matchScore = calculateMatchScore(currentUser, otherUser);
          
          partners.push({
            user: otherUser,
            conversationId,
            lastMessage,
            matchScore
          });
        }
      }
    });
    
    // Sort by: AI bot first, then by last message time
    return partners.sort((a, b) => {
      // AI chat bot always appears first
      if (a.isAIChatBot) return -1;
      if (b.isAIChatBot) return 1;
      
      // Then sort by last message time
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });
  };
  
  const handleSelectConversation = (conversationId, user) => {
    setSelectedConversationId(conversationId);
    setSelectedUser(user);
    setMessageText('');
  };
  
  const handleSendMessage = (text) => {
    if (!currentUser || !text.trim()) return;
    
    if (!selectedConversationId && selectedUser) {
      // Create new conversation
      const conversationId = getConversationId(currentUser.id, selectedUser.id);
      const convos = getConversations();
      
      convos[conversationId] = {
        participants: [currentUser.id, selectedUser.id],
        messages: [{
          senderId: currentUser.id,
          text: text.trim(),
          timestamp: new Date().toISOString()
        }]
      };
      
      setConversations(convos);
      setConversationsState(convos);
      setSelectedConversationId(conversationId);
      setShowIcebreaker(false);
      setMessageText('');
      
      // Check if message is to AI bot and trigger auto-reply
      const isAIBot = selectedUser?.isAIBot || selectedUser?.id === AI_CHAT_BOT_ID;
      
      if (isAIBot) {
        // Show typing indicator
        setIsAIBotTyping(true);
        
        // Wait 2-4 seconds, then force immediate reply
        const delay = 2000 + Math.random() * 2000; // 2-4 seconds
        setTimeout(() => {
          const conversationId = getConversationId(currentUser.id, selectedUser.id);
          const replySent = forceImmediateReply(conversationId, currentUser.id);
          console.log('AI Bot reply sent:', replySent);
          setIsAIBotTyping(false);
          
          // Refresh conversations multiple times to ensure update
          setTimeout(() => {
            const updatedConvos = getConversations();
            setConversationsState(updatedConvos);
          }, 500);
          
          setTimeout(() => {
            const updatedConvos = getConversations();
            setConversationsState(updatedConvos);
          }, 1500);
        }, delay);
      }
      return;
    }
    
    if (selectedConversationId) {
      const convos = getConversations();
      if (!convos[selectedConversationId]) {
        convos[selectedConversationId] = {
          participants: [currentUser.id, selectedUser.id],
          messages: []
        };
      }
      
      convos[selectedConversationId].messages.push({
        senderId: currentUser.id,
        text: text.trim(),
        timestamp: new Date().toISOString()
      });
      
      setConversations(convos);
      setConversationsState(convos);
      setMessageText('');
      
      // Check if message is to AI bot and trigger auto-reply
      const isAIBot = selectedUser?.isAIBot || selectedUser?.id === AI_CHAT_BOT_ID;
      
      if (isAIBot) {
        // Show typing indicator
        setIsAIBotTyping(true);
        
        // Wait 2-4 seconds, then force immediate reply
        const delay = 2000 + Math.random() * 2000; // 2-4 seconds
        setTimeout(() => {
          const replySent = forceImmediateReply(selectedConversationId, currentUser.id);
          console.log('AI Bot reply sent:', replySent);
          setIsAIBotTyping(false);
          
          // Refresh conversations multiple times to ensure update
          setTimeout(() => {
            const updatedConvos = getConversations();
            setConversationsState(updatedConvos);
          }, 500);
          
          setTimeout(() => {
            const updatedConvos = getConversations();
            setConversationsState(updatedConvos);
          }, 1500);
        }, delay);
      }
    }
  };
  
  const handleSendFromInput = () => {
    if (messageText.trim()) {
      handleSendMessage(messageText);
    }
  };
  
  // Get conversations from both state and localStorage to ensure we have the latest
  const allConversations = { ...getConversations(), ...conversations };
  
  const currentMessages = selectedConversationId && allConversations[selectedConversationId]
    ? (allConversations[selectedConversationId].messages || [])
    : [];
  
  const conversationPartners = getAllConversationPartners();
  console.log('Conversation partners:', conversationPartners.length, conversationPartners);
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Trendy background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 -z-10"></div>
      <div className="relative z-10">
      {!currentUser ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
            <p className="text-dark-600 font-semibold text-lg">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-80px)]">
          {/* Conversations List */}
          <div className="w-full md:w-96 glass-effect border-r border-white/30 flex flex-col shadow-soft">
            <div className="p-6 border-b border-white/30 bg-gradient-to-r from-primary-50 to-accent-50">
              <h2 className="text-2xl font-black text-dark-900 font-display">Messages</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversationPartners.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 mb-4">No conversations yet</p>
                  <Button onClick={() => router.push('/matches')}>
                    View Matches
                  </Button>
                </div>
              ) : (
                conversationPartners.map(({ user, conversationId, lastMessage, matchScore }) => (
                  <button
                    key={conversationId}
                    onClick={() => handleSelectConversation(conversationId, user)}
                    className={`w-full p-5 text-left border-b border-white/20 hover:bg-white/50 transition-all duration-300 ${
                      selectedConversationId === conversationId 
                        ? 'bg-gradient-to-r from-primary-50 to-accent-50 border-l-4 border-l-primary-500' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-medium"
                        />
                      ) : (
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl border-2 border-white shadow-medium ${
                          user.id === AI_CHAT_BOT_ID 
                            ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500' 
                            : 'gradient-primary'
                        }`}>
                          {user.id === AI_CHAT_BOT_ID ? '🤖' : user.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-dark-900 truncate text-lg font-display">{user.name}</p>
                            {(user.isAIBot || user.id === AI_CHAT_BOT_ID) && (
                              <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-black rounded-lg uppercase tracking-wide">
                                {user.id === AI_CHAT_BOT_ID ? '🤖 AI CHAT' : 'AI BOT'}
                              </span>
                            )}
                          </div>
                          {matchScore && (
                            <span className="text-sm text-primary-600 font-black bg-primary-100 px-3 py-1 rounded-xl">
                              {matchScore.percentage}%
                            </span>
                          )}
                        </div>
                        {lastMessage && (
                          <p className="text-sm text-dark-600 truncate font-medium">
                            {lastMessage.senderId === currentUser.id && <span className="font-bold">You: </span>}
                            {lastMessage.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
          
          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="glass-effect border-b border-white/30 p-6 bg-gradient-to-r from-primary-50/50 to-accent-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {selectedUser.photoUrl ? (
                        <img
                          src={selectedUser.photoUrl}
                          alt={selectedUser.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-medium"
                        />
                      ) : (
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg border-2 border-white shadow-medium ${
                          selectedUser.id === AI_CHAT_BOT_ID 
                            ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500' 
                            : 'gradient-primary'
                        }`}>
                          {selectedUser.id === AI_CHAT_BOT_ID ? '🤖' : selectedUser.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-black text-dark-900 text-xl font-display">{selectedUser.name}</h3>
                          {(selectedUser.isAIBot || selectedUser.id === AI_CHAT_BOT_ID) && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-black rounded-xl uppercase tracking-wide border-2 border-white/30">
                              {selectedUser.id === AI_CHAT_BOT_ID ? '🤖 AI CHAT' : '🤖 AI BOT'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-dark-600 font-semibold mt-1">
                          {selectedUser.id === AI_CHAT_BOT_ID ? 'Always Available' : `${selectedUser.age} • ${selectedUser.location}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Location Sharing Button */}
                      {!selectedUser.isAIBot && selectedUser.id !== AI_CHAT_BOT_ID && (
                        <Button
                          onClick={() => {
                            const share = LocationSharing.shareLocation(
                              currentUser.id,
                              selectedUser.id,
                              60 // 60 minutes
                            );
                            showToast('Location shared for 60 minutes', 'success');
                          }}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          title="Share your location (60 min)"
                        >
                          <MapPinIcon className="w-5 h-5" />
                          <span className="hidden sm:inline">Share Location</span>
                        </Button>
                      )}
                      {/* Video Chat Button - Hide for AI bots */}
                      {!selectedUser.isAIBot && selectedUser.id !== AI_CHAT_BOT_ID && (
                        <Button
                          onClick={() => setShowVideoChat(true)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <VideoCameraIcon className="w-5 h-5" />
                          <span className="hidden sm:inline">Video</span>
                        </Button>
                      )}
                      
                      {/* Safety Actions */}
                      <SafetyActions
                        userId={selectedUser.id}
                        userName={selectedUser.name}
                        onBlock={(userId) => {
                          showToast('User blocked', 'success');
                          router.push('/discover');
                        }}
                        onReport={(userId, reason) => {
                          showToast('User reported. Thank you for keeping VibeMatch safe.', 'success');
                        }}
                      />
                      
                      {/* Edit Bot Button - Only show for AI bots */}
                      {(selectedUser.isAIBot || selectedUser.id === AI_CHAT_BOT_ID) && (
                        <Button
                          onClick={() => router.push('/ai-chat-settings')}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Cog6ToothIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">Customize Bot</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Video Chat Modal */}
                <VideoChat
                  isOpen={showVideoChat}
                  onClose={() => setShowVideoChat(false)}
                  otherUser={selectedUser}
                  currentUser={currentUser}
                />
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* AI Conversation Assistant */}
                  {selectedUser && currentMessages.length > 0 && (
                    <AIConversationAssistant
                      currentUser={currentUser}
                      otherUser={selectedUser}
                      conversationHistory={currentMessages}
                      onSuggestionSelect={(text) => {
                        setMessageText(text);
                      }}
                    />
                  )}
                  
                  {currentMessages.length === 0 ? (
                    <div className="text-center py-12">
                      {(selectedUser?.id === AI_CHAT_BOT_ID) ? (
                        <>
                          <div className="text-6xl mb-4">🤖</div>
                          <p className="text-gray-700 font-semibold mb-2">Your AI Assistant is ready to chat!</p>
                          <p className="text-gray-500 mb-4">Ask me anything, or just say hello!</p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-500 mb-4">No messages yet. Start the conversation!</p>
                          <Button onClick={() => setShowIcebreaker(true)}>
                            Send Icebreaker
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    currentMessages.map((message, idx) => {
                      const isOwn = message.senderId === currentUser.id;
                      const allUsers = getAllUsers();
                      const messageSender = allUsers.find(u => u.id === message.senderId);
                      const isFromAIBot = messageSender?.isAIBot || messageSender?.id === AI_CHAT_BOT_ID || message.isAI;
                      
                      return (
                        <div
                          key={idx}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} flex-col`}
                        >
                          {!isOwn && isFromAIBot && (
                            <span className="text-xs text-blue-600 mb-1 px-2">🤖 AI Bot Message</span>
                          )}
                          <div
                            className={`max-w-md px-5 py-3 rounded-2xl shadow-medium ${
                              isOwn
                                ? 'gradient-primary text-white'
                                : isFromAIBot
                                ? 'bg-blue-50 text-gray-900 border-2 border-blue-300'
                                : 'bg-white text-dark-900 border-2 border-dark-100'
                            }`}
                          >
                            <p className="font-medium leading-relaxed">{message.text}</p>
                            <div className={`flex items-center gap-2 text-xs mt-2 font-semibold ${
                              isOwn ? 'text-white/80' : 'text-dark-500'
                            }`}>
                              <span>{formatDate(message.timestamp)}</span>
                              {isFromAIBot && !isOwn && <span className="bg-blue-500/20 text-blue-700 px-2 py-0.5 rounded-full">• AI Generated</span>}
                              {isOwn && (
                                <>
                                  {hasPremiumFeature(currentUser, 'READ_RECEIPTS') && message.read ? (
                                    <span className="text-blue-200 font-black" title="Read">✓✓</span>
                                  ) : hasPremiumFeature(currentUser, 'READ_RECEIPTS') ? (
                                    <span className="text-white/70" title="Sent">✓</span>
                                  ) : (
                                    <span className="text-white/50 flex items-center gap-1" title="Read receipts available in Premium">
                                      ✓
                                      <PremiumBadge user={currentUser} variant="badge" size="xs" showUpgrade={false} />
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  
                  {/* AI Bot Typing Indicator */}
                  {isAIBotTyping && selectedUser && (selectedUser.isAIBot || selectedUser.id === AI_CHAT_BOT_ID) && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl px-5 py-3 shadow-soft">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-700 text-sm font-bold">🤖 {selectedUser.name || 'AI Assistant'} is typing</span>
                          <span className="flex gap-1">
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="glass-effect border-t border-white/30 p-5 bg-gradient-to-r from-white/80 to-primary-50/30">
                  {showVoiceRecorder ? (
                    <VoiceMessage
                      onSend={async (audioBlob) => {
                        try {
                          const voiceData = await uploadVoiceMessage(audioBlob, selectedConversationId);
                          const convos = { ...conversations };
                          if (!convos[selectedConversationId]) {
                            convos[selectedConversationId] = {
                              participants: [currentUser.id, selectedUser.id],
                              messages: []
                            };
                          }
                          convos[selectedConversationId].messages.push({
                            senderId: currentUser.id,
                            text: '[Voice Message]',
                            voiceUrl: voiceData.url,
                            timestamp: new Date().toISOString()
                          });
                          setConversations(convos);
                          setConversationsState(convos);
                          setShowVoiceRecorder(false);
                        } catch (error) {
                          showToast('Failed to send voice message', 'error');
                        }
                      }}
                      onCancel={() => setShowVoiceRecorder(false)}
                    />
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowVoiceRecorder(true)}
                        className="px-4 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center justify-center"
                        title="Voice Message"
                      >
                        <MicrophoneIcon className="w-6 h-6 text-gray-700" />
                      </button>
                      <button
                        onClick={() => setShowGifPicker(!showGifPicker)}
                        className="px-4 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center justify-center"
                        title="GIFs & Stickers"
                      >
                        <FaceSmileIcon className="w-6 h-6 text-gray-700" />
                      </button>
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendFromInput()}
                        placeholder="Type a message..."
                        className="flex-1 px-5 py-3.5 border-2 border-dark-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200 bg-white text-dark-900 placeholder:text-dark-400 font-medium shadow-soft"
                      />
                      <Button
                        onClick={handleSendFromInput}
                        disabled={!messageText.trim()}
                        size="lg"
                        className="shadow-glow"
                      >
                        <PaperAirplaneIcon className="w-6 h-6" />
                      </Button>
                      {/* GIF/Sticker Picker */}
                      {showGifPicker && (
                        <div className="absolute bottom-full right-0 mb-2 z-50">
                          <GifStickerPicker
                            onSelect={(item) => {
                              if (item.type === 'gif') {
                                handleSendMessage(`[GIF: ${item.title}]`);
                              } else {
                                handleSendMessage(item.emoji);
                              }
                              setShowGifPicker(false);
                            }}
                            onClose={() => setShowGifPicker(false)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">Select a conversation or start a new one</p>
                  <Button onClick={() => router.push('/matches')}>
                    View Matches
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Icebreaker Modal */}
      <Modal
        isOpen={showIcebreaker}
        onClose={() => setShowIcebreaker(false)}
        title="Start the Conversation"
      >
        {currentUser && selectedUser && (
          <IcebreakerPrompts
            currentUser={currentUser}
            otherUser={selectedUser}
            onSend={(message) => {
              handleSendMessage(message);
              setShowIcebreaker(false);
            }}
          />
        )}
      </Modal>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
