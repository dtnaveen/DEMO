'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  ArrowLeftIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  FlagIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { showToast } from '@/utils/helpers';

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id;
  const [currentUser, setCurrentUser] = useState(null);
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    // Mock post data
    const mockPost = {
      id: postId,
      title: 'How I met my match!',
      author: 'Alex M.',
      authorId: 'user1',
      authorAvatar: null,
      content: `I just wanted to share my amazing story with everyone here. After being on VibeMatch for just a few weeks, I found someone truly special. 

We matched on a Friday evening, and the conversation just flowed naturally. We talked about our shared love for hiking and photography. The next day, we decided to meet at a local coffee shop.

The connection was instant! We ended up talking for hours, and now we've been dating for three months. I never thought online dating could work so well, but VibeMatch's matching algorithm really understood what I was looking for.

For anyone who's feeling discouraged, don't give up! The right person is out there, and sometimes it just takes a bit of patience and being open to new experiences.`,
      replies: 12,
      views: 145,
      likes: 23,
      createdAt: '2 days ago',
      category: 'Success Stories',
      pinned: true
    };

    // Mock replies
    const mockReplies = [
      {
        id: '1',
        author: 'Sarah K.',
        authorId: 'user2',
        content: 'This is so inspiring! Congratulations! 🎉',
        likes: 5,
        createdAt: '1 day ago',
        liked: false
      },
      {
        id: '2',
        author: 'Mike T.',
        authorId: 'user3',
        content: 'That\'s amazing! How did you break the ice in your first message?',
        likes: 3,
        createdAt: '1 day ago',
        liked: false
      },
      {
        id: '3',
        author: 'Emma L.',
        authorId: 'user4',
        content: 'So happy for you both! This gives me hope ❤️',
        likes: 8,
        createdAt: '12 hours ago',
        liked: true
      }
    ];

    setPost(mockPost);
    setReplies(mockReplies);
    setLoading(false);
  }, [postId, router]);

  const handleLike = () => {
    setLiked(!liked);
    setPost(prev => ({
      ...prev,
      likes: prev.likes + (liked ? -1 : 1)
    }));
    showToast(liked ? 'Removed like' : 'Liked post', 'success');
  };

  const handleReplyLike = (replyId) => {
    setReplies(prev => prev.map(reply => {
      if (reply.id === replyId) {
        const wasLiked = reply.liked;
        return {
          ...reply,
          liked: !wasLiked,
          likes: reply.likes + (wasLiked ? -1 : 1)
        };
      }
      return reply;
    }));
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      showToast('Please enter a reply', 'warning');
      return;
    }

    const newReply = {
      id: `reply_${Date.now()}`,
      author: currentUser?.name || 'You',
      authorId: currentUser?.id || 'current',
      content: replyText,
      likes: 0,
      createdAt: 'Just now',
      liked: false
    };

    setReplies([...replies, newReply]);
    setReplyText('');
    setPost(prev => ({ ...prev, replies: prev.replies + 1 }));
    showToast('Reply posted successfully', 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content.substring(0, 100) + '...',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard', 'success');
    }
  };

  const handleReport = () => {
    showToast('Report submitted. Thank you for keeping the community safe.', 'info');
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

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Post not found</p>
          <Button onClick={() => router.push('/forums')}>
            Back to Forums
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Post Content */}
        <Card className="mb-6 p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                  {post.category}
                </span>
                {post.pinned && (
                  <span className="px-2 py-1 bg-accent-100 text-accent-700 rounded text-xs font-medium">
                    Pinned
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-dark-900 mb-3 font-display">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-dark-500 mb-4">
                <span className="flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  {post.createdAt}
                </span>
                <span>{post.views} views</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {post.content}
            </p>
          </div>

          {/* Post Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                liked
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {liked ? (
                <HeartIconSolid className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span className="font-medium">{post.likes}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              <ShareIcon className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>

            <button
              onClick={handleReport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all ml-auto"
            >
              <FlagIcon className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Report</span>
            </button>
          </div>
        </Card>

        {/* Reply Form */}
        <Card className="mb-6 p-4 sm:p-6">
          <h2 className="text-xl font-bold text-dark-900 mb-4">Add a Reply</h2>
          <form onSubmit={handleSubmitReply}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
            />
            <div className="flex justify-end mt-4">
              <Button type="submit" disabled={!replyText.trim()}>
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                Post Reply
              </Button>
            </div>
          </form>
        </Card>

        {/* Replies Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-dark-900 mb-4">
            Replies ({replies.length})
          </h2>
          {replies.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No replies yet. Be the first to reply!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <Card key={reply.id} className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-dark-900">{reply.author}</span>
                        <span className="text-xs text-gray-500">{reply.createdAt}</span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleReplyLike(reply.id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                        reply.liked
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {reply.liked ? (
                        <HeartIconSolid className="w-4 h-4" />
                      ) : (
                        <HeartIcon className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{reply.likes}</span>
                    </button>
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

