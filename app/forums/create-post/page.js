'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { showToast } from '@/utils/helpers';

const FORUM_CATEGORIES = [
  'Success Stories',
  'Dating Tips',
  'Profile Help',
  'General Discussion',
  'Questions',
  'Announcements',
  'Feedback'
];

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forumId = searchParams?.get('forum');
  const [currentUser, setCurrentUser] = useState(null);
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
        icon: '💕'
      },
      {
        id: '2',
        name: 'Dating Tips',
        description: 'Tips and advice for better dating',
        icon: '💡'
      },
      {
        id: '3',
        name: 'Profile Help',
        description: 'Get help optimizing your profile',
        icon: '📝'
      },
      {
        id: '4',
        name: 'General Discussion',
        description: 'General chat and discussions',
        icon: '💬'
      },
      {
        id: '5',
        name: 'Questions & Answers',
        description: 'Ask questions and get answers',
        icon: '❓'
      },
      {
        id: '6',
        name: 'Announcements',
        description: 'Official announcements',
        icon: '📢'
      },
      {
        id: '7',
        name: 'Feedback & Suggestions',
        description: 'Share feedback and suggestions',
        icon: '💭'
      }
    ];

    setForums(mockForums);

    if (forumId) {
      const forum = mockForums.find(f => f.id === forumId);
      if (forum) {
        setSelectedForum(forum);
        setCategory(forum.name);
      }
    }

    setLoading(false);
  }, [forumId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showToast('Please enter a title', 'warning');
      return;
    }

    if (!content.trim()) {
      showToast('Please enter post content', 'warning');
      return;
    }

    if (!category) {
      showToast('Please select a category', 'warning');
      return;
    }

    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    showToast('Post created successfully!', 'success');
    
    // Redirect to forum or post detail
    if (selectedForum) {
      router.push(`/forums?forum=${selectedForum.id}`);
    } else {
      router.push('/forums');
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Create Post Form */}
        <Card className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900 mb-6 font-display">
            Create New Post
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Forum Selection */}
            {!selectedForum && (
              <div>
                <label className="block text-sm font-semibold text-dark-900 mb-2">
                  Select Forum (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {forums.map(forum => (
                    <button
                      key={forum.id}
                      type="button"
                      onClick={() => {
                        setSelectedForum(forum);
                        setCategory(forum.name);
                      }}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{forum.icon}</span>
                        <div>
                          <div className="font-semibold text-dark-900">{forum.name}</div>
                          <div className="text-xs text-gray-600">{forum.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {selectedForum && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Selected: {selectedForum.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedForum(null);
                        setCategory('');
                      }}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {FORUM_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      category === cat
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2">
                Post Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title..."
                className="w-full"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/200 characters</p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2">
                Post Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !title.trim() || !content.trim() || !category}
                className="w-full sm:w-auto"
              >
                {submitting ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

