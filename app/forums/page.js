'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ChatBubbleLeftRightIcon,
  FireIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

/**
 * Community Forums Page
 * Discussion forums for community engagement
 */
export default function ForumsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    // Mock forums data
    const mockForums = [
      {
        id: '1',
        name: 'Success Stories',
        description: 'Share your VibeMatch success stories',
        posts: 124,
        members: 450,
        icon: '💕',
      },
      {
        id: '2',
        name: 'Dating Tips',
        description: 'Tips and advice for better dating experiences',
        posts: 89,
        members: 320,
        icon: '💡',
      },
      {
        id: '3',
        name: 'Profile Help',
        description: 'Get help optimizing your profile',
        posts: 67,
        members: 280,
        icon: '📝',
      },
      {
        id: '4',
        name: 'General Discussion',
        description: 'General chat and discussions',
        posts: 234,
        members: 890,
        icon: '💬',
      },
    ];

    setForums(mockForums);

    // Mock posts for selected forum
    const mockPosts = [
      {
        id: '1',
        title: 'How I met my match!',
        author: 'Alex M.',
        authorAvatar: null,
        replies: 12,
        views: 145,
        lastActivity: '2 hours ago',
        pinned: true,
      },
      {
        id: '2',
        title: 'First date ideas?',
        author: 'Jordan K.',
        authorAvatar: null,
        replies: 8,
        views: 89,
        lastActivity: '5 hours ago',
        pinned: false,
      },
    ];

    setPosts(mockPosts);
  }, [router]);

  const handleSelectForum = (forum) => {
    setSelectedForum(forum);
    // In production, fetch posts for this forum
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-dark-900 mb-2 font-display">
            <span className="text-gradient">Community Forums</span>
          </h1>
          <p className="text-dark-600 text-lg font-medium">
            Join discussions, share experiences, and connect with the community
          </p>
        </div>

        {!selectedForum ? (
          /* Forums List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forums.map(forum => (
              <Card
                key={forum.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleSelectForum(forum)}
              >
                <div className="p-6">
                  <div className="text-5xl mb-4">{forum.icon}</div>
                  <h3 className="text-2xl font-black text-dark-900 mb-2 font-display">
                    {forum.name}
                  </h3>
                  <p className="text-dark-600 mb-4">{forum.description}</p>
                  <div className="flex items-center gap-4 text-sm text-dark-500">
                    <span className="flex items-center gap-1">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      {forum.posts} posts
                    </span>
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />
                      {forum.members} members
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Forum Posts */
          <div>
            <Button
              onClick={() => setSelectedForum(null)}
              variant="outline"
              className="mb-6"
            >
              ← Back to Forums
            </Button>

            <Card className="mb-6 p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{selectedForum.icon}</span>
                <div>
                  <h2 className="text-3xl font-black text-dark-900 font-display">
                    {selectedForum.name}
                  </h2>
                  <p className="text-dark-600">{selectedForum.description}</p>
                </div>
              </div>
              <Button>Create New Post</Button>
            </Card>

            <div className="space-y-4">
              {posts.map(post => (
                <Card key={post.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {post.pinned && (
                          <FireIcon className="w-5 h-5 text-accent-600" />
                        )}
                        <h3 className="text-xl font-bold text-dark-900">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-dark-500 mb-3">
                        <span>By {post.author}</span>
                        <span className="flex items-center gap-1">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          {post.replies} replies
                        </span>
                        <span>{post.views} views</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {post.lastActivity}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

