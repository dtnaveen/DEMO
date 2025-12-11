'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  UserGroupIcon, 
  PlusIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

/**
 * Interest-Based Groups Page
 * Communities based on shared interests
 */
export default function GroupsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    // Mock groups data
    const mockGroups = [
      {
        id: '1',
        name: 'Music Lovers',
        description: 'Share your favorite songs and discover new music together',
        members: 1250,
        icon: '🎵',
        interests: ['Music', 'Concerts', 'Spotify'],
        isMember: true
      },
      {
        id: '2',
        name: 'Fitness Enthusiasts',
        description: 'Connect with people who love staying active',
        members: 890,
        icon: '💪',
        interests: ['Fitness', 'Gym', 'Running'],
        isMember: false
      },
      {
        id: '3',
        name: 'Travel Buddies',
        description: 'Find travel companions and share adventures',
        members: 2100,
        icon: '✈️',
        interests: ['Travel', 'Adventure', 'Exploring'],
        isMember: true
      },
      {
        id: '4',
        name: 'Gaming Community',
        description: 'For gamers of all types - console, PC, mobile',
        members: 1500,
        icon: '🎮',
        interests: ['Gaming', 'Esports', 'Streaming'],
        isMember: false
      },
      {
        id: '5',
        name: 'Foodies',
        description: 'Share recipes, restaurant recommendations, and food adventures',
        members: 980,
        icon: '🍕',
        interests: ['Food', 'Cooking', 'Restaurants'],
        isMember: false
      },
      {
        id: '6',
        name: 'Book Club',
        description: 'Discuss books, share recommendations, and join reading challenges',
        members: 750,
        icon: '📚',
        interests: ['Reading', 'Books', 'Literature'],
        isMember: false
      }
    ];

    setGroups(mockGroups);
    setUserGroups(mockGroups.filter(g => g.isMember));
  }, [router]);

  const handleJoinGroup = (groupId) => {
    setGroups(groups.map(g => 
      g.id === groupId ? { ...g, isMember: true, members: g.members + 1 } : g
    ));
    setUserGroups([...userGroups, groups.find(g => g.id === groupId)]);
  };

  const handleLeaveGroup = (groupId) => {
    setGroups(groups.map(g => 
      g.id === groupId ? { ...g, isMember: false, members: Math.max(0, g.members - 1) } : g
    ));
    setUserGroups(userGroups.filter(g => g.id !== groupId));
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Interest Groups</h1>
            <p className="text-gray-600">Join communities based on shared interests</p>
          </div>
          <Button>
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Group
          </Button>
        </div>

        {/* My Groups */}
        {userGroups.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGroups.map((group) => (
                <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{group.icon}</div>
                    <Button
                      onClick={() => handleLeaveGroup(group.id)}
                      variant="outline"
                      size="sm"
                    >
                      Leave
                    </Button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{group.members} members</span>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <CalendarIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Groups */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Discover Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{group.icon}</div>
                  {group.isMember ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Member
                    </span>
                  ) : (
                    <Button
                      onClick={() => handleJoinGroup(group.id)}
                      size="sm"
                    >
                      Join
                    </Button>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{group.members} members</span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <CalendarIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

