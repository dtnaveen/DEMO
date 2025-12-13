'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  ChatBubbleLeftRightIcon,
  FireIcon,
  ClockIcon,
  UserIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { showToast } from '@/utils/helpers';

/**
 * Forum Categories
 */
const FORUM_CATEGORIES = [
  'All',
  'Success Stories',
  'Dating Tips',
  'Profile Help',
  'General Discussion',
  'Questions',
  'Announcements',
  'Feedback'
];

/**
 * Community Forums Page
 * Discussion forums for community engagement
 */
export default function ForumsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, popular, trending
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [forumsPerPage] = useState(9);
  const [currentForumPage, setCurrentForumPage] = useState(1);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    // Mock forums data with more variety
    const mockForums = [
      {
        id: '1',
        name: 'Success Stories',
        description: 'Share your VibeMatch success stories and celebrate connections',
        posts: 124,
        members: 450,
        icon: '💕',
        category: 'Success Stories',
        recentPost: '2 hours ago'
      },
      {
        id: '2',
        name: 'Dating Tips',
        description: 'Tips and advice for better dating experiences',
        posts: 89,
        members: 320,
        icon: '💡',
        category: 'Dating Tips',
        recentPost: '5 hours ago'
      },
      {
        id: '3',
        name: 'Profile Help',
        description: 'Get help optimizing your profile to attract better matches',
        posts: 67,
        members: 280,
        icon: '📝',
        category: 'Profile Help',
        recentPost: '1 day ago'
      },
      {
        id: '4',
        name: 'General Discussion',
        description: 'General chat and discussions about dating and relationships',
        posts: 234,
        members: 890,
        icon: '💬',
        category: 'General Discussion',
        recentPost: '30 minutes ago'
      },
      {
        id: '5',
        name: 'Questions & Answers',
        description: 'Ask questions and get answers from the community',
        posts: 156,
        members: 520,
        icon: '❓',
        category: 'Questions',
        recentPost: '1 hour ago'
      },
      {
        id: '6',
        name: 'Announcements',
        description: 'Official announcements and updates from VibeMatch',
        posts: 45,
        members: 1200,
        icon: '📢',
        category: 'Announcements',
        recentPost: '3 hours ago'
      },
      {
        id: '7',
        name: 'Feedback & Suggestions',
        description: 'Share your feedback and suggestions to improve VibeMatch',
        posts: 78,
        members: 380,
        icon: '💭',
        category: 'Feedback',
        recentPost: '4 hours ago'
      }
    ];

    setForums(mockForums);

    // Check if forum ID is in URL
    const forumId = searchParams?.get('forum');
    if (forumId) {
      const forum = mockForums.find(f => f.id === forumId);
      if (forum) {
        setSelectedForum(forum);
      }
    }

    // Mock posts for selected forum
    const mockPosts = [
      {
        id: '1',
        title: 'How I met my match!',
        author: 'Alex M.',
        authorId: 'user1',
        authorAvatar: null,
        replies: 12,
        views: 145,
        likes: 23,
        lastActivity: '2 hours ago',
        pinned: true,
        category: 'Success Stories',
        content: 'I just wanted to share my amazing story...'
      },
      {
        id: '2',
        title: 'First date ideas?',
        author: 'Jordan K.',
        authorId: 'user2',
        authorAvatar: null,
        replies: 8,
        views: 89,
        likes: 15,
        lastActivity: '5 hours ago',
        pinned: false,
        category: 'Dating Tips',
        content: 'Looking for some creative first date suggestions...'
      },
      {
        id: '3',
        title: 'Best profile photo tips',
        author: 'Sam T.',
        authorId: 'user3',
        authorAvatar: null,
        replies: 25,
        views: 234,
        likes: 42,
        lastActivity: '1 hour ago',
        pinned: false,
        category: 'Profile Help',
        content: 'Here are some tips that worked for me...'
      },
      {
        id: '4',
        title: 'What makes a great conversation starter?',
        author: 'Taylor R.',
        authorId: 'user4',
        authorAvatar: null,
        replies: 18,
        views: 167,
        likes: 31,
        lastActivity: '3 hours ago',
        pinned: false,
        category: 'General Discussion',
        content: 'I always struggle with the first message...'
      },
      {
        id: '5',
        title: 'New feature: Video profiles!',
        author: 'VibeMatch Team',
        authorId: 'admin',
        authorAvatar: null,
        replies: 45,
        views: 567,
        likes: 89,
        lastActivity: '6 hours ago',
        pinned: true,
        category: 'Announcements',
        content: 'We\'re excited to announce video profiles...'
      }
    ];

    setPosts(mockPosts);
    setLoading(false);
  }, [router, searchParams]);

  const handleSelectForum = (forum) => {
    setSelectedForum(forum);
    router.push(`/forums?forum=${forum.id}`);
    // In production, fetch posts for this forum
  };

  const handleViewPost = (postId) => {
    router.push(`/forums/post/${postId}`);
  };

  const handleCreatePost = () => {
    if (!selectedForum) {
      showToast('Please select a forum first', 'info');
      return;
    }
    router.push(`/forums/create-post?forum=${selectedForum.id}`);
  };

  const handleBackToForums = () => {
    setSelectedForum(null);
    router.push('/forums');
  };

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      switch (sortBy) {
        case 'popular':
          return (b.replies + b.likes) - (a.replies + a.likes);
        case 'trending':
          return b.views - a.views;
        case 'recent':
        default:
          // Sort by lastActivity (simplified - in production use actual dates)
          return 0;
      }
    });

  // Filter forums by category and search
  const filteredForums = forums.filter(forum => {
    const matchesCategory = selectedCategory === 'All' || forum.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      forum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination for forums
  const totalForumPages = Math.ceil(filteredForums.length / forumsPerPage);
  const indexOfLastForum = currentForumPage * forumsPerPage;
  const indexOfFirstForum = indexOfLastForum - forumsPerPage;
  const currentForums = filteredForums.slice(indexOfFirstForum, indexOfLastForum);

  // Pagination for posts
  const totalPostPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setCurrentForumPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {!selectedForum ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-dark-900 mb-2 font-display">
                <span className="text-gradient">Community Forums</span>
              </h1>
              <p className="text-dark-600 text-base sm:text-lg font-medium">
                Join discussions, share experiences, and connect with the community
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search forums..."
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
                {FORUM_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Forums List */}
            {filteredForums.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No forums found. Try adjusting your category filter or search query.</p>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {currentForums.map(forum => (
                  <Card
                    key={forum.id}
                    className="cursor-pointer hover:shadow-lg transition-all p-4 sm:p-6"
                    onClick={() => handleSelectForum(forum)}
                  >
                    <div className="text-4xl sm:text-5xl mb-4">{forum.icon}</div>
                    <h3 className="text-xl sm:text-2xl font-black text-dark-900 mb-2 font-display">
                      {forum.name}
                    </h3>
                    <p className="text-dark-600 mb-4 text-sm sm:text-base">{forum.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm text-dark-500">
                      <span className="flex items-center gap-1">
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        {forum.posts} posts
                      </span>
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        {forum.members} members
                      </span>
                      <span className="text-xs text-gray-400">{forum.recentPost}</span>
                    </div>
                  </Card>
                  ))}
                </div>

                {/* Pagination for Forums */}
                {totalForumPages > 1 && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <Button
                      onClick={() => setCurrentForumPage(prev => Math.max(1, prev - 1))}
                      disabled={currentForumPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalForumPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentForumPage(page)}
                        variant={currentForumPage === page ? 'primary' : 'outline'}
                        size="sm"
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      onClick={() => setCurrentForumPage(prev => Math.min(totalForumPages, prev + 1))}
                      disabled={currentForumPage === totalForumPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          /* Forum Posts View */
          <div>
            {/* Back Button */}
            <Button
              onClick={handleBackToForums}
              variant="outline"
              className="mb-6"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Forums
            </Button>

            {/* Forum Header */}
            <Card className="mb-6 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <span className="text-3xl sm:text-4xl">{selectedForum.icon}</span>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-dark-900 font-display mb-1">
                    {selectedForum.name}
                  </h2>
                  <p className="text-dark-600 text-sm sm:text-base">{selectedForum.description}</p>
                </div>
              </div>
              <Button onClick={handleCreatePost} className="w-full sm:w-auto">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create New Post
              </Button>
            </Card>

            {/* Search and Sort */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search posts..."
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

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="flex gap-2">
                  {['recent', 'popular', 'trending'].map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        sortBy === sort
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sort.charAt(0).toUpperCase() + sort.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts List */}
            {filteredAndSortedPosts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No posts found. Try adjusting your search or filters.</p>
                <Button onClick={handleCreatePost} className="mt-4">
                  Create First Post
                </Button>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {currentPosts.map(post => (
                  <Card 
                    key={post.id} 
                    className="p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewPost(post.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {post.pinned && (
                            <FireIcon className="w-5 h-5 text-accent-600 flex-shrink-0" />
                          )}
                          <h3 className="text-lg sm:text-xl font-bold text-dark-900">
                            {post.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-dark-500">
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <ChatBubbleLeftRightIcon className="w-4 h-4" />
                            {post.replies} replies
                          </span>
                          <span>{post.views} views</span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {post.lastActivity}
                          </span>
                          {post.likes > 0 && (
                            <span className="text-primary-600">❤️ {post.likes}</span>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPost(post.id);
                        }}
                        className="w-full sm:w-auto"
                      >
                        View
                      </Button>
                    </div>
                  </Card>
                  ))}
                </div>

                {/* Pagination for Posts */}
                {totalPostPages > 1 && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPostPages }, (_, i) => i + 1).map((page) => (
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
                      onClick={() => setCurrentPage(prev => Math.min(totalPostPages, prev + 1))}
                      disabled={currentPage === totalPostPages}
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
      </div>
    </div>
  );
}
