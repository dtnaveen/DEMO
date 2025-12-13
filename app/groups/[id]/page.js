'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ArrowLeftIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  UserIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { showToast } from '@/utils/helpers';

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id;
  const [currentUser, setCurrentUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    // Mock group data
    const mockGroup = {
      id: groupId,
      name: 'Music Lovers',
      description: 'Share your favorite songs and discover new music together. Join us for discussions about artists, albums, concerts, and everything music-related!',
      members: 1250,
      icon: '🎵',
      interests: ['Music', 'Concerts', 'Spotify', 'Vinyl', 'Live Shows'],
      isMember: true,
      createdBy: 'Alex M.',
      createdAt: '2 years ago',
      rules: [
        'Be respectful to all members',
        'No spam or self-promotion',
        'Keep discussions music-related',
        'Share your favorite tracks and artists'
      ]
    };

    // Mock members
    const mockMembers = [
      { id: '1', name: 'Alex M.', role: 'Admin', avatar: null },
      { id: '2', name: 'Sarah K.', role: 'Member', avatar: null },
      { id: '3', name: 'Mike T.', role: 'Member', avatar: null },
      { id: '4', name: 'Emma L.', role: 'Member', avatar: null },
      { id: '5', name: 'Jordan R.', role: 'Member', avatar: null }
    ];

    setGroup(mockGroup);
    setIsMember(mockGroup.isMember);
    setMembers(mockMembers);
    setLoading(false);
  }, [groupId, router]);

  const handleJoin = () => {
    setIsMember(true);
    setGroup(prev => ({ ...prev, members: prev.members + 1, isMember: true }));
    showToast(`Joined ${group.name}!`, 'success');
  };

  const handleLeave = () => {
    setIsMember(false);
    setGroup(prev => ({ ...prev, members: Math.max(0, prev.members - 1), isMember: false }));
    showToast('Left group successfully', 'success');
    setTimeout(() => {
      router.push('/groups');
    }, 1500);
  };

  const handleChat = () => {
    router.push(`/groups/${groupId}/chat`);
    showToast('Opening group chat...', 'info');
  };

  const handleEvents = () => {
    router.push(`/groups/${groupId}/events`);
    showToast('Opening group events...', 'info');
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Group not found</p>
          <Button onClick={() => router.push('/groups')}>
            Back to Groups
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Group Header */}
        <Card className="mb-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <div className="text-5xl sm:text-6xl">{group.icon}</div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 mb-2 font-display">
                {group.name}
              </h1>
              <p className="text-dark-600 text-sm sm:text-base mb-4">{group.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-dark-500 mb-4">
                <span className="flex items-center gap-1">
                  <UserGroupIcon className="w-5 h-5" />
                  {group.members} members
                </span>
                <span className="flex items-center gap-1">
                  <UserIcon className="w-5 h-5" />
                  Created by {group.createdBy}
                </span>
                <span>{group.createdAt}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            {isMember ? (
              <>
                <Button onClick={handleChat} className="flex-1 sm:flex-none">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                  Group Chat
                </Button>
                <Button onClick={handleEvents} variant="outline" className="flex-1 sm:flex-none">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Events
                </Button>
                <Button onClick={handleLeave} variant="danger" className="flex-1 sm:flex-none">
                  Leave Group
                </Button>
              </>
            ) : (
              <Button onClick={handleJoin} className="w-full sm:w-auto">
                <PlusIcon className="w-4 h-4 mr-2" />
                Join Group
              </Button>
            )}
          </div>
        </Card>

        {/* Group Rules */}
        <Card className="mb-6 p-4 sm:p-6">
          <h2 className="text-xl font-bold text-dark-900 mb-4">Group Rules</h2>
          <ul className="space-y-2">
            {group.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
                <span className="text-primary-600 mt-1">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Recent Members */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-dark-900">Recent Members</h2>
            <Button variant="outline" size="sm" onClick={() => showToast('View all members feature coming soon!', 'info')}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {members.map((member) => (
              <div key={member.id} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">
                  {member.name.charAt(0)}
                </div>
                <p className="text-sm font-semibold text-dark-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

