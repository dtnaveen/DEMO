'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { showToast } from '@/utils/helpers';

const AVAILABLE_INTERESTS = [
  'Music', 'Fitness', 'Travel', 'Gaming', 'Food', 'Reading', 'Sports',
  'Art', 'Photography', 'Technology', 'Movies', 'Cooking', 'Dancing',
  'Writing', 'Hiking', 'Yoga', 'Cycling', 'Swimming', 'Running'
];

const GROUP_ICONS = [
  '🎵', '💪', '✈️', '🎮', '🍕', '📚', '⚽', '🎨', '📷', '💻',
  '🎬', '👨‍🍳', '💃', '✍️', '🥾', '🧘', '🚴', '🏊', '🏃'
];

export default function CreateGroupPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState('🎵');
  const [rules, setRules] = useState(['Be respectful to all members']);
  const [newRule, setNewRule] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    setLoading(false);
  }, [router]);

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, interest]);
      } else {
        showToast('Maximum 5 interests allowed', 'warning');
      }
    }
  };

  const handleAddRule = () => {
    if (newRule.trim() && rules.length < 10) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    } else if (rules.length >= 10) {
      showToast('Maximum 10 rules allowed', 'warning');
    }
  };

  const handleRemoveRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showToast('Please enter a group name', 'warning');
      return;
    }

    if (!description.trim()) {
      showToast('Please enter a group description', 'warning');
      return;
    }

    if (selectedInterests.length === 0) {
      showToast('Please select at least one interest', 'warning');
      return;
    }

    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    showToast('Group created successfully!', 'success');
    router.push('/groups');
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 py-8 px-4 sm:px-6 lg:px-8">
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

        {/* Create Group Form */}
        <Card className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-black text-dark-900 mb-6 font-display">
            Create New Group
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2">
                Group Icon
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                {GROUP_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                      selectedIcon === icon
                        ? 'border-primary-600 bg-primary-50 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2">
                Group Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full"
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">{name.length}/50 characters</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your group..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">{description.length} characters</p>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2">
                Interests <span className="text-red-500">*</span> ({selectedInterests.length}/5)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedInterests.includes(interest)
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2">
                Group Rules ({rules.length}/10)
              </label>
              <div className="space-y-2 mb-3">
                {rules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="flex-1 text-sm text-gray-700">{rule}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Add a rule..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRule();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddRule}
                  variant="outline"
                  disabled={!newRule.trim() || rules.length >= 10}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200">
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
                disabled={submitting || !name.trim() || !description.trim() || selectedInterests.length === 0}
                className="w-full sm:w-auto"
              >
                {submitting ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

