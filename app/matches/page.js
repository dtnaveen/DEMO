'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getMatches, getAllUsers } from '@/lib/localStorage';
import { calculateMatchScore, getSharedInterests } from '@/lib/matchingAlgorithm';
import { showToast } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import MatchScore from '@/components/ui/MatchScore';

export default function MatchesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [matches, setMatchesState] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/onboard');
      return;
    }
    
    setCurrentUser(user);
    
    // Get matches
    const allMatches = getMatches();
    const allUsers = getAllUsers();
    
    // Filter matches for current user
    const userMatches = allMatches.filter(
      m => m.userId1 === user.id || m.userId2 === user.id
    );
    
    // Get matched user details
    const matched = userMatches.map(match => {
      const otherUserId = match.userId1 === user.id ? match.userId2 : match.userId1;
      const otherUser = allUsers.find(u => u.id === otherUserId);
      
      if (otherUser) {
        const matchScore = calculateMatchScore(user, otherUser);
        const sharedInterests = getSharedInterests(user, otherUser);
        
        return {
          ...otherUser,
          matchScore,
          sharedInterests,
          matchTimestamp: match.timestamp
        };
      }
      return null;
    }).filter(Boolean);
    
    setMatchedUsers(matched);
    setMatchesState(userMatches);
    setLoading(false);
  }, [router]);
  
  const handleMessage = (userId) => {
    router.push(`/messages?userId=${userId}`);
  };
  
  const handleViewProfile = (userId) => {
    router.push(`/profile/${userId}`);
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
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4">
      {/* Trendy background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 -z-10"></div>
      <div className="relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Matches</h1>
          <p className="text-gray-600 mt-2">
            {matchedUsers.length} mutual {matchedUsers.length === 1 ? 'match' : 'matches'}
          </p>
        </div>
        
        {matchedUsers.length === 0 ? (
          <Card className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No matches yet</h2>
              <p className="text-gray-600 mb-6">
                Keep exploring! Start liking profiles to find your perfect match.
              </p>
              <Button onClick={() => router.push('/discover')}>
                Start Discovering
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedUsers.map(user => (
              <Card key={user.id} className="overflow-hidden">
                {/* Profile Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary to-secondary -mx-6 -mt-6 mb-4">
                  {user.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  
                  {/* Match Badge */}
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
                    <span className="text-sm font-bold text-primary">{user.matchScore?.percentage}%</span>
                  </div>
                  
                  {/* AI Bot Badge */}
                  {user.isAIBot && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-full px-3 py-1 shadow-lg">
                      <span className="text-xs font-semibold">🤖 AI BOT</span>
                    </div>
                  )}
                </div>
                
                {/* User Info */}
                <div className="px-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                    {user.isAIBot && (
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded">
                        AI BOT
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {user.age} • {user.location}
                  </p>
                  
                  {/* Match Score */}
                  {user.matchScore && (
                    <div className="mb-4">
                      <MatchScore score={user.matchScore} />
                    </div>
                  )}
                  
                  {/* Shared Interests */}
                  {user.sharedInterests && user.sharedInterests.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Shared interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.sharedInterests.slice(0, 3).map((interest, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {interest.answer}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleViewProfile(user.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => handleMessage(user.id)}
                      size="sm"
                      className="flex-1"
                    >
                      Message
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
