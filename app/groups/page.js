'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  UserGroupIcon, 
  PlusIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { showToast } from '@/utils/helpers';

/**
 * Interest-Based Groups Page
 * Communities based on shared interests
 */
export default function GroupsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMyGroupsPage, setCurrentMyGroupsPage] = useState(1);
  const [groupsPerPage] = useState(9);
  const [myGroupsPerPage] = useState(6);

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

  const handleLeaveGroup = (groupId) => {
    setGroups(groups.map(g => 
      g.id === groupId ? { ...g, isMember: false, members: Math.max(0, g.members - 1) } : g
    ));
    setUserGroups(userGroups.filter(g => g.id !== groupId));
    showToast('Left group successfully', 'success');
  };

  const handleJoinGroup = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setGroups(groups.map(g => 
        g.id === groupId ? { ...g, isMember: true, members: g.members + 1 } : g
      ));
      setUserGroups([...userGroups, { ...group, isMember: true }]);
      showToast(`Joined ${group.name}!`, 'success');
    }
  };

  const handleViewGroup = (groupId) => {
    router.push(`/groups/${groupId}`);
  };

  const handleCreateGroup = () => {
    router.push('/groups/create');
  };

  const handleGroupChat = (groupId, e) => {
    e.stopPropagation();
    router.push(`/groups/${groupId}/chat`);
    showToast('Opening group chat...', 'info');
  };

  const handleGroupEvents = (groupId, e) => {
    e.stopPropagation();
    router.push(`/groups/${groupId}/events`);
    showToast('Opening group events...', 'info');
  };

  // Filter groups
  const allInterests = Array.from(new Set(groups.flatMap(g => g.interests)));
  const filteredGroups = groups.filter(group => {
    const matchesSearch = searchQuery === '' || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || 
      group.interests.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const filteredUserGroups = userGroups.filter(group => {
    const matchesSearch = searchQuery === '' || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || 
      group.interests.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);

  const totalMyGroupsPages = Math.ceil(filteredUserGroups.length / myGroupsPerPage);
  const indexOfLastMyGroup = currentMyGroupsPage * myGroupsPerPage;
  const indexOfFirstMyGroup = indexOfLastMyGroup - myGroupsPerPage;
  const currentMyGroups = filteredUserGroups.slice(indexOfFirstMyGroup, indexOfLastMyGroup);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setCurrentMyGroupsPage(1);
  }, [selectedCategory, searchQuery]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-dark-900 mb-2 font-display">
              <span className="text-gradient">Interest Groups</span>
            </h1>
            <p className="text-dark-600 text-base sm:text-lg font-medium">
              Join communities based on shared interests
            </p>
          </div>
          <Button onClick={handleCreateGroup} className="w-full sm:w-auto">
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Group
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'All'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              All
            </button>
            {allInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => setSelectedCategory(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === interest
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* My Groups */}
        {filteredUserGroups.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-dark-900 mb-6 font-display">
              My Groups ({filteredUserGroups.length})
            </h2>
            {currentMyGroups.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No groups found matching your filters.</p>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {currentMyGroups.map((group) => (
                    <Card 
                      key={group.id} 
                      className="p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleViewGroup(group.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl sm:text-4xl">{group.icon}</div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeaveGroup(group.id);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Leave
                        </Button>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-dark-900 mb-2">{group.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {group.interests.slice(0, 3).map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-dark-500 pt-4 border-t border-gray-200">
                        <span className="flex items-center gap-1">
                          <UserGroupIcon className="w-4 h-4" />
                          {group.members} members
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => handleGroupChat(group.id, e)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Group Chat"
                          >
                            <ChatBubbleLeftRightIcon className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={(e) => handleGroupEvents(group.id, e)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Group Events"
                          >
                            <CalendarIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination for My Groups */}
                {totalMyGroupsPages > 1 && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <Button
                      onClick={() => setCurrentMyGroupsPage(prev => Math.max(1, prev - 1))}
                      disabled={currentMyGroupsPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalMyGroupsPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentMyGroupsPage(page)}
                        variant={currentMyGroupsPage === page ? 'primary' : 'outline'}
                        size="sm"
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      onClick={() => setCurrentMyGroupsPage(prev => Math.min(totalMyGroupsPages, prev + 1))}
                      disabled={currentMyGroupsPage === totalMyGroupsPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* All Groups */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-dark-900 mb-6 font-display">
            Discover Groups ({filteredGroups.length})
          </h2>
          {currentGroups.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No groups found. Try adjusting your search or filters.</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentGroups.map((group) => (
                  <Card 
                    key={group.id} 
                    className="p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => handleViewGroup(group.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl sm:text-4xl">{group.icon}</div>
                      {group.isMember ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Member
                        </span>
                      ) : (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinGroup(group.id);
                          }}
                          size="sm"
                        >
                          Join
                        </Button>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-dark-900 mb-2">{group.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.interests.slice(0, 3).map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                      {group.interests.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          +{group.interests.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-dark-500 pt-4 border-t border-gray-200">
                      <span className="flex items-center gap-1">
                        <UserGroupIcon className="w-4 h-4" />
                        {group.members} members
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => handleGroupChat(group.id, e)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Group Chat"
                        >
                          <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => handleGroupEvents(group.id, e)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Group Events"
                        >
                          <CalendarIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination for All Groups */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? 'primary' : 'outline'}
                      size="sm"
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

