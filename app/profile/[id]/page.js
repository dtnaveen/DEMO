'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentUser, getAllUsers } from '@/lib/localStorage';
import { calculateMatchScore, getSharedInterests, getSharedContent } from '@/lib/matchingAlgorithm';
import { VALUE_QUESTIONS, CONTENT_QUESTIONS } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MatchScore from '@/components/ui/MatchScore';
import Modal from '@/components/ui/Modal';
import IcebreakerPrompts from '@/components/ui/IcebreakerPrompts';
import { getConversationId } from '@/utils/helpers';
import { getConversations, setConversations } from '@/lib/localStorage';

export default function ViewProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  
  const [currentUser, setCurrentUser] = useState(null);
  const [viewedUser, setViewedUser] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [sharedInterests, setSharedInterests] = useState([]);
  const [sharedContent, setSharedContent] = useState([]);
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/onboard');
      return;
    }
    
    setCurrentUser(user);
    
    // Get the viewed user
    const allUsers = getAllUsers();
    const userToView = allUsers.find(u => u.id === userId);
    
    if (!userToView) {
      router.push('/discover');
      return;
    }
    
    setViewedUser(userToView);
    
    // Calculate match score
    const score = calculateMatchScore(user, userToView);
    setMatchScore(score);
    
    // Get shared interests and content
    setSharedInterests(getSharedInterests(user, userToView));
    setSharedContent(getSharedContent(user, userToView));
    
    setLoading(false);
  }, [userId, router]);
  
  const handleStartConversation = () => {
    setShowIcebreaker(true);
  };
  
  const handleSendMessage = (message) => {
    if (!currentUser || !viewedUser) return;
    
    const conversationId = getConversationId(currentUser.id, viewedUser.id);
    const conversations = getConversations();
    
    if (!conversations[conversationId]) {
      conversations[conversationId] = {
        participants: [currentUser.id, viewedUser.id],
        messages: []
      };
    }
    
    conversations[conversationId].messages.push({
      senderId: currentUser.id,
      text: message,
      timestamp: new Date().toISOString()
    });
    
    setConversations(conversations);
    setShowIcebreaker(false);
    router.push(`/messages?userId=${viewedUser.id}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!viewedUser || !currentUser) {
    return null;
  }
  
  const contentQuestions = CONTENT_QUESTIONS[viewedUser.ageGroup] || [];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-6"
        >
          ← Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Header */}
          <Card className="md:col-span-1">
            <div className="text-center">
              {viewedUser.photoUrl ? (
                <img 
                  src={viewedUser.photoUrl} 
                  alt={viewedUser.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-64 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-6xl font-bold mb-4">
                  {viewedUser.name.charAt(0)}
                </div>
              )}
              
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{viewedUser.name}</h2>
                {viewedUser.isAIBot && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                    🤖 AI BOT
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-2">{viewedUser.age} years old</p>
              <p className="text-gray-600 mb-4">{viewedUser.location}</p>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {viewedUser.ageGroup}
              </div>
              {viewedUser.isAIBot && (
                <div className="mt-4 space-y-2">
                  <Button
                    onClick={() => router.push('/bot-profile')}
                    className="w-full"
                  >
                    Configure Bot Settings
                  </Button>
                </div>
              )}
              {viewedUser.isAIBot && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-700">
                    <strong>🤖 AI Bot Profile:</strong> This profile is powered by AI and automatically engages with users to help you discover matches!
                  </p>
                </div>
              )}
              
              {/* Match Score */}
              {matchScore && (
                <div className="mt-4">
                  <MatchScore score={matchScore} showBreakdown={true} />
                </div>
              )}
              
              {/* Action Button */}
              <div className="mt-6">
                <Button onClick={handleStartConversation} fullWidth>
                  Start Conversation
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Profile Details */}
          <Card className="md:col-span-2">
            {/* Bio */}
            {viewedUser.bio && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-700">{viewedUser.bio}</p>
              </div>
            )}
            
            {/* Shared Interests */}
            {sharedInterests.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why you matched</h3>
                <div className="flex flex-wrap gap-2">
                  {sharedInterests.map((interest, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {interest.answer}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Value Answers */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Values</h3>
              <div className="space-y-4">
                {VALUE_QUESTIONS.map((question, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <p className="font-medium text-gray-900 mb-1">{question.question}</p>
                    {viewedUser.valueAnswers && viewedUser.valueAnswers[idx] !== undefined ? (
                      <p className="text-gray-600">{question.options[viewedUser.valueAnswers[idx]]}</p>
                    ) : (
                      <p className="text-gray-400 italic">Not answered</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Content Preferences */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Preferences</h3>
              <div className="space-y-4">
                {contentQuestions.map((question, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <p className="font-medium text-gray-900 mb-1">{question.question}</p>
                    {viewedUser.contentAnswers && viewedUser.contentAnswers[idx] !== undefined ? (
                      <p className="text-gray-600">{question.options[viewedUser.contentAnswers[idx]]}</p>
                    ) : (
                      <p className="text-gray-400 italic">Not answered</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Icebreaker Modal */}
      <Modal
        isOpen={showIcebreaker}
        onClose={() => setShowIcebreaker(false)}
        title="Start the Conversation"
      >
        {currentUser && viewedUser && (
          <IcebreakerPrompts
            currentUser={currentUser}
            otherUser={viewedUser}
            onSend={handleSendMessage}
          />
        )}
      </Modal>
    </div>
  );
}
