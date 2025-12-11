'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from '@/components/ui/ProfileCard';
import FilterPanel from '@/components/ui/FilterPanel';
import DiscoveryModes from '@/components/ui/DiscoveryModes';
import AIConversationAssistant from '@/components/ui/AIConversationAssistant';
import AdBanner from '@/components/ui/AdBanner';
import { getCurrentUser, getAllUsers, setMatches, getMatches, getUserActions, addLike, addPass, setCurrentUser } from '@/lib/localStorage';
import { calculateMatchScore, getSharedInterests } from '@/lib/matchingAlgorithm';
import { showToast } from '@/utils/helpers';
import { sendAutoMessagesFromSarah } from '@/lib/autoMessaging';
import { setupAIBotAutoReplies } from '@/lib/aiBotReplies';
import { isPremiumUser, getDailyLikesRemaining, recordLike, hasPremiumFeature } from '@/lib/subscription';
import { getDistanceBetweenUsers, hasGPSCoordinates, getCoordinatesFromLocation, calculateDistance } from '@/lib/gpsUtils';
import { TravelMode, RealTimeLocationTracker } from '@/lib/advancedGPS';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function DiscoverPage() {
  const router = useRouter();
  const [currentUser, setCurrentUserState] = useState(null);
  const [allUsers, setAllUsersState] = useState([]);
  const [filters, setFilters] = useState({
    ageRange: [18, 50],
    distance: 25,
    genderPreference: ['Everyone'],
    relationshipTypes: [],
    minMatchPercentage: 60,
    nicheFilters: []
  });
  const [loading, setLoading] = useState(true);
  const [likesRemaining, setLikesRemaining] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [discoveryMode, setDiscoveryMode] = useState('discover'); // 'discover', 'explore', 'speed'
  const [speedDatingTimer, setSpeedDatingTimer] = useState(30);
  const [travelMode, setTravelMode] = useState(null);
  const locationTrackerRef = useRef(null);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/onboard');
      return;
    }
    
    setCurrentUserState(user);
    
    // Check likes remaining for free users
    const remaining = getDailyLikesRemaining(user);
    setLikesRemaining(remaining);
    
    // Load all users
    const users = getAllUsers();
    setAllUsersState(users);
    
    // Initialize filters from user preferences
    if (user.preferences) {
      setFilters({
        ageRange: user.preferences.ageRange || [18, 50],
        distance: user.preferences.distance || 25,
        genderPreference: user.preferences.genderPreference || ['Everyone'],
        relationshipTypes: [],
        minMatchPercentage: 60,
        nicheFilters: []
      });
    }
    
        // Check for Travel Mode (only on client to prevent hydration errors)
        if (typeof window !== 'undefined') {
          try {
            const activeTravelMode = TravelMode.getTravelMode(user);
            if (activeTravelMode) {
              setTravelMode(activeTravelMode);
              const effectiveLocation = TravelMode.getEffectiveLocation(user);
              setUserLocation({
                latitude: effectiveLocation.latitude,
                longitude: effectiveLocation.longitude
              });
            } else {
              // Get user's GPS coordinates
              // First check if user already has GPS coordinates
              if (hasGPSCoordinates(user)) {
                setUserLocation({
                  latitude: user.latitude,
                  longitude: user.longitude
                });
              } else if (user.location) {
                // Try to get coordinates from location name
                const coords = getCoordinatesFromLocation(user.location);
                setUserLocation(coords);
                
                // Update user with GPS coordinates
                const updatedUser = {
                  ...user,
                  latitude: coords.latitude,
                  longitude: coords.longitude
                };
                setCurrentUser(updatedUser);
                setCurrentUserState(updatedUser);
              }
            }
          } catch (error) {
            // Fallback to regular location if TravelMode fails
            if (hasGPSCoordinates(user)) {
              setUserLocation({
                latitude: user.latitude,
                longitude: user.longitude
              });
            } else if (user.location) {
              const coords = getCoordinatesFromLocation(user.location);
              setUserLocation(coords);
            }
          }
        } else {
          // Server-side: just use user's existing coordinates
          if (hasGPSCoordinates(user)) {
            setUserLocation({
              latitude: user.latitude,
              longitude: user.longitude
            });
          } else if (user.location) {
            const coords = getCoordinatesFromLocation(user.location);
            setUserLocation(coords);
          }
        }
        
        // Initialize real-time location tracking for premium users
        if (isPremiumUser(user) && typeof window !== 'undefined' && navigator.geolocation) {
          try {
            const tracker = new RealTimeLocationTracker(user.id);
          tracker.startTracking((location) => {
            setUserLocation({
              latitude: location.latitude,
              longitude: location.longitude
            });
            // Update user location
            const updatedUser = {
              ...user,
              latitude: location.latitude,
              longitude: location.longitude,
              lastActive: new Date().toISOString()
            };
            setCurrentUser(updatedUser);
            setCurrentUserState(updatedUser);
          }).catch(() => {
            // Silently fail if location tracking not available
          });
          locationTrackerRef.current = tracker;
        } catch (error) {
          // Silently fail if location tracking not available
          // GPS errors are expected when location services are unavailable
          // Only log unexpected errors in development
          if (process.env.NODE_ENV === 'development' && error.code && error.code !== 1 && error.code !== 2 && error.code !== 3) {
            console.debug('Location tracking setup error:', error.message || 'GPS unavailable');
          }
        }
      }
      
      // Cleanup on unmount
      return () => {
        if (locationTrackerRef.current) {
          locationTrackerRef.current.stopTracking();
          locationTrackerRef.current = null;
        }
      };
    }, [router]);
    
    // Separate effect for loading state
    useEffect(() => {
      if (currentUser) {
        setLoading(false);
      }
    }, [currentUser]);
    
    // Separate effect for auto-messaging and AI bot setup
    useEffect(() => {
      // Send auto-messages from Sarah to all users (including current user)
      setTimeout(() => {
        sendAutoMessagesFromSarah();
      }, 1000);
      
      // Setup AI bot auto-reply system
      setupAIBotAutoReplies();
    }, []);
  
  // Apply filters and calculate matches based on discovery mode
  const processedUsers = useMemo(() => {
    if (!currentUser) return [];
    
    const actions = getUserActions();
    const passes = actions?.passes || [];
    const likes = actions?.likes || [];
    
    const filteredAndProcessed = allUsers
      .filter(user => {
        // Don't show current user
        if (user.id === currentUser.id) return false;
        
        // Don't show passed users
        if (passes.includes(user.id)) return false;
        
        // Age range filter
        if (user.age < filters.ageRange[0] || user.age > filters.ageRange[1]) {
          return false;
        }
        
        // Gender preference filter
        if (!filters.genderPreference.includes(user.gender) && 
            !filters.genderPreference.includes('Everyone')) {
          return false;
        }
        
        // Relationship type filter
        if (filters.relationshipTypes && filters.relationshipTypes.length > 0) {
          const userLookingFor = user.preferences?.lookingFor || '';
          if (!filters.relationshipTypes.includes(userLookingFor)) {
            return false;
          }
        }
        
        // GPS Distance filter
        if (userLocation && filters.distance) {
          // Ensure user has GPS coordinates, if not, try to get from location name
          let userCoords = null;
          if (hasGPSCoordinates(user)) {
            userCoords = { latitude: user.latitude, longitude: user.longitude };
          } else if (user.location) {
            userCoords = getCoordinatesFromLocation(user.location);
          }
          
          if (userCoords) {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              userCoords.latitude,
              userCoords.longitude
            );
            
            if (distance > filters.distance) {
              return false;
            }
          }
        }
        
        // Calculate match score
        const matchScore = calculateMatchScore(currentUser, user);
        
        // Minimum match percentage
        if (matchScore.percentage < filters.minMatchPercentage) {
          return false;
        }
        
        // Niche filters (simplified implementation)
        if (filters.nicheFilters && filters.nicheFilters.length > 0) {
          // Add niche filter logic here if needed
        }
        
        return true;
      })
      .map(user => {
        const matchScore = calculateMatchScore(currentUser, user);
        const sharedInterests = getSharedInterests(currentUser, user);
        
        // Calculate distance if GPS coordinates are available
        let distance = null;
        if (userLocation) {
          let userCoords = null;
          if (hasGPSCoordinates(user)) {
            userCoords = { latitude: user.latitude, longitude: user.longitude };
          } else if (user.location) {
            userCoords = getCoordinatesFromLocation(user.location);
          }
          
          if (userCoords) {
            distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              userCoords.latitude,
              userCoords.longitude
            );
          }
        }
        
        return {
          ...user,
          matchScore,
          sharedInterests,
          distance
        };
      });
    
    // Apply discovery mode sorting/filtering
    if (discoveryMode === 'discover') {
      // Algorithm-based: Sort by match score
      return filteredAndProcessed.sort((a, b) => b.matchScore.percentage - a.matchScore.percentage);
    } else if (discoveryMode === 'explore') {
      // Explore: Show all, sorted by recent activity or random
      // Use stable sort to avoid hydration issues
      // Sort by match score descending, then by name for consistency
      return filteredAndProcessed.sort((a, b) => {
        const scoreA = a.matchScore?.percentage || 0;
        const scoreB = b.matchScore?.percentage || 0;
        const scoreDiff = scoreB - scoreA;
        if (scoreDiff !== 0) return scoreDiff;
        return (a.name || '').localeCompare(b.name || '');
      });
    } else if (discoveryMode === 'speed') {
      // Speed dating: Sort by match score, show top matches
      return filteredAndProcessed
        .sort((a, b) => b.matchScore.percentage - a.matchScore.percentage)
        .slice(0, 10); // Limit for speed dating
    }
    
    return filteredAndProcessed;
  }, [allUsers, currentUser, filters, userLocation, discoveryMode]);
  
  const handleLike = (userId) => {
    if (!currentUser) return;
    
    // Check if user can like (free users have daily limit)
    if (!isPremiumUser(currentUser)) {
      const canLike = recordLike(currentUser);
      if (!canLike) {
        showToast('Daily like limit reached! Upgrade to Premium for unlimited likes.', 'error');
        return;
      }
      // Update remaining likes
      const remaining = getDailyLikesRemaining(currentUser);
      setLikesRemaining(remaining);
    }
    
    addLike(userId);
    
    // Check if mutual like
    const otherUser = allUsers.find(u => u.id === userId);
    if (otherUser) {
      // For demo purposes, simulate mutual likes based on high match score
      // In a real app, this would check the other user's likes
      const matchScore = calculateMatchScore(currentUser, otherUser);
      
      // Simulate: if match score is high, create a match (simulating mutual like)
      if (matchScore.percentage >= 75) {
        const matches = getMatches();
        const existingMatch = matches.find(
          m => (m.userId1 === currentUser.id && m.userId2 === userId) ||
               (m.userId1 === userId && m.userId2 === currentUser.id)
        );
        
        if (!existingMatch) {
          matches.push({
            userId1: currentUser.id,
            userId2: userId,
            matchScore: matchScore.percentage,
            timestamp: new Date().toISOString()
          });
          setMatches(matches);
          showToast('It\'s a match! 🎉', 'success');
        } else {
          showToast('Like sent!', 'info');
        }
      } else {
        showToast('Like sent!', 'info');
      }
    }
    
    // Remove from view
    setAllUsersState(prev => prev.filter(u => u.id !== userId));
  };
  
  const handlePass = (userId) => {
    addPass(userId);
    setAllUsersState(prev => prev.filter(u => u.id !== userId));
  };
  
  const handleViewProfile = (user) => {
    router.push(`/profile/${user.id}`);
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
  
  const isPremium = isPremiumUser(currentUser);
  
  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Trendy background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 -z-10"></div>
      <div 
        className="fixed inset-0 opacity-30 -z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-6xl md:text-7xl font-black mb-3 font-trendy">
                <span className="text-gradient bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Discover
                </span>
              </h1>
              <p className="text-gray-700 text-xl font-semibold">Find your perfect match ✨</p>
            </div>
            {!isPremium && (
              <Link href="/subscription" className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-3xl font-black text-lg shadow-2xl hover:shadow-neon transform hover:scale-110 transition-all duration-300 inline-flex items-center gap-2 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <SparklesIcon className="w-6 h-6" />
                  <span>Go Premium</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}
          </div>
          
          {/* Free User Limitations Banner - Trendy */}
          {!isPremium && (
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative glass-effect rounded-3xl p-6 border-2 border-yellow-300/50 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl floating">💛</div>
                    <div>
                      <span className="text-gray-900 font-black text-2xl block">
                        {likesRemaining === 'unlimited' ? 'Unlimited' : `${likesRemaining} likes left today`}
                      </span>
                      {likesRemaining !== 'unlimited' && likesRemaining <= 3 && (
                        <span className="text-orange-600 font-bold text-sm mt-1 block">⚠️ Almost out!</span>
                      )}
                    </div>
                  </div>
                  <Link href="/subscription" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-black hover:shadow-neon transform hover:scale-110 transition-all duration-300">
                    Get Unlimited →
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {/* Travel Mode Indicator */}
          {travelMode && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-100 border border-blue-200 rounded-lg p-4 mb-6 text-center shadow-md">
              <p className="text-lg font-semibold text-gray-800">
                ✈️ Travel Mode Active
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Viewing matches in <span className="font-bold">{travelMode.destination}</span>
              </p>
            </div>
          )}
          
          {/* Premium Badge - Trendy */}
          {isPremium && (
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative glass-effect rounded-3xl p-6 border-2 border-purple-300/50 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="text-5xl floating pulse-glow">⭐</div>
                  <div>
                    <span className="text-gray-900 font-black text-2xl font-trendy block">Premium Member</span>
                    <p className="text-gray-600 font-semibold">Unlimited everything! 🚀</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Discovery Modes */}
        <div className="mb-6">
          <DiscoveryModes
            currentMode={discoveryMode}
            onModeChange={setDiscoveryMode}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              currentUserAgeGroup={currentUser.ageGroup}
            />
          </div>
          
          {/* User Cards */}
          <div className="lg:col-span-3">
            {processedUsers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-xl text-gray-600 mb-2">No matches found</p>
                <p className="text-gray-500">
                  Try adjusting your filters or check back later for new users.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(() => {
                  // Check if user should see ads (free users only)
                  // Premium users have ad-free experience, so only show ads to free users
                  const showAds = !isPremium;
                  const adFrequency = 3; // Show ad after every 3 profiles
                  
                  // Create array with profiles and ads interleaved
                  const items = [];
                  processedUsers.forEach((user, idx) => {
                    // Add profile
                    items.push({
                      type: 'profile',
                      data: user,
                      index: idx
                    });
                    
                    // Add ad after every N profiles for free users
                    if (showAds && (idx + 1) % adFrequency === 0 && idx < processedUsers.length - 1) {
                      items.push({
                        type: 'ad',
                        data: { id: `premium-upgrade-ad-${idx}` },
                        index: idx
                      });
                    }
                  });
                  
                  return items.map((item, itemIdx) => {
                    if (item.type === 'ad') {
                      return (
                        <div 
                          key={item.data.id}
                          className="md:col-span-2 lg:col-span-3 transform transition-all duration-500"
                          style={{
                            animationDelay: `${itemIdx * 100}ms`,
                          }}
                        >
                          <AdBanner adId={item.data.id} />
                        </div>
                      );
                    } else {
                      const user = item.data;
                      return (
                        <div 
                          key={user.id}
                          className="transform transition-all duration-500 hover:scale-105"
                          style={{
                            animationDelay: `${itemIdx * 100}ms`,
                          }}
                        >
                          <ProfileCard
                            user={user}
                            matchScore={user.matchScore}
                            sharedInterests={user.sharedInterests}
                            distance={user.distance}
                            onLike={() => handleLike(user.id)}
                            onPass={() => handlePass(user.id)}
                            onView={() => handleViewProfile(user)}
                          />
                        </div>
                      );
                    }
                  });
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
