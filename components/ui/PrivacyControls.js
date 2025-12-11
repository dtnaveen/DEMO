'use client';

import { useState, useEffect } from 'react';
import { ShieldCheckIcon, EyeIcon, EyeSlashIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Card from './Card';
import Button from './Button';
import { getCurrentUser, setCurrentUser, getAllUsers, setAllUsers } from '@/lib/localStorage';
import { showToast } from '@/utils/helpers';

/**
 * PrivacyControls Component
 * Manages user privacy settings
 */
export default function PrivacyControls() {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // public, friends, private
    showAge: true,
    showLocation: true,
    showDistance: true,
    showOnlineStatus: true,
    showLastSeen: true,
    allowMessagesFrom: 'everyone', // everyone, matches, nobody
    showReadReceipts: true,
    allowProfileViews: true,
    hideFromDiscovery: false,
    showSocialMedia: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setPrivacySettings(user.privacySettings || privacySettings);
    }
    setLoading(false);
  }, []);

  const handleSave = () => {
    const user = getCurrentUser();
    if (!user) return;

    const updatedUser = {
      ...user,
      privacySettings
    };

    // Update in all users
    const allUsers = getAllUsers();
    const userIndex = allUsers.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      allUsers[userIndex] = { ...allUsers[userIndex], ...updatedUser };
      setAllUsers(allUsers);
    }

    setCurrentUser(updatedUser);
    showToast('Privacy settings saved!', 'success');
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
      </div>

      {/* Profile Visibility */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <GlobeAltIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Profile Visibility</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who can see your profile?
            </label>
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="public">Everyone</option>
              <option value="matches">Matches Only</option>
              <option value="private">Private (Hidden)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Information Visibility */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <EyeIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Information Visibility</h3>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Show Age</span>
              <input
                type="checkbox"
                checked={privacySettings.showAge}
                onChange={(e) => setPrivacySettings({ ...privacySettings, showAge: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Show Location</span>
              <input
                type="checkbox"
                checked={privacySettings.showLocation}
                onChange={(e) => setPrivacySettings({ ...privacySettings, showLocation: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Show Distance</span>
              <input
                type="checkbox"
                checked={privacySettings.showDistance}
                onChange={(e) => setPrivacySettings({ ...privacySettings, showDistance: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Show Social Media Links</span>
              <input
                type="checkbox"
                checked={privacySettings.showSocialMedia}
                onChange={(e) => setPrivacySettings({ ...privacySettings, showSocialMedia: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary"
              />
            </label>
          </div>
        </div>
      </Card>

      {/* Activity Visibility */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <EyeSlashIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Activity Visibility</h3>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Show Online Status</span>
              <input
                type="checkbox"
                checked={privacySettings.showOnlineStatus}
                onChange={(e) => setPrivacySettings({ ...privacySettings, showOnlineStatus: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Show Last Seen</span>
              <input
                type="checkbox"
                checked={privacySettings.showLastSeen}
                onChange={(e) => setPrivacySettings({ ...privacySettings, showLastSeen: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Show Read Receipts</span>
              <input
                type="checkbox"
                checked={privacySettings.showReadReceipts}
                onChange={(e) => setPrivacySettings({ ...privacySettings, showReadReceipts: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary"
              />
            </label>
          </div>
        </div>
      </Card>

      {/* Messaging Privacy */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Messaging Privacy</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who can message you?
            </label>
            <select
              value={privacySettings.allowMessagesFrom}
              onChange={(e) => setPrivacySettings({ ...privacySettings, allowMessagesFrom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="everyone">Everyone</option>
              <option value="matches">Matches Only</option>
              <option value="nobody">Nobody (Disable Messages)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Discovery Settings */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Discovery Settings</h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Hide from Discovery</span>
              <input
                type="checkbox"
                checked={privacySettings.hideFromDiscovery}
                onChange={(e) => setPrivacySettings({ ...privacySettings, hideFromDiscovery: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary"
              />
            </label>
            <p className="text-xs text-gray-500">When enabled, your profile won't appear in discovery</p>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Allow Profile Views</span>
              <input
                type="checkbox"
                checked={privacySettings.allowProfileViews}
                onChange={(e) => setPrivacySettings({ ...privacySettings, allowProfileViews: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary"
              />
            </label>
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Save Privacy Settings
      </Button>
    </div>
  );
}

