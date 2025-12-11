'use client';

import { useState } from 'react';
import { 
  PhotoIcon, 
  SpeakerWaveIcon,
  PaperClipIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import Input from './Input';
import Button from './Button';

/**
 * SocialMediaIntegration Component
 * Allows users to link Instagram and Spotify
 */
export default function SocialMediaIntegration({ 
  socialMedia = {},
  onSocialMediaChange 
}) {
  const [instagram, setInstagram] = useState(socialMedia.instagram || '');
  const [spotify, setSpotify] = useState(socialMedia.spotify || '');
  const [customLinks, setCustomLinks] = useState(socialMedia.customLinks || []);

  const handleSave = () => {
    const updated = {
      instagram: instagram.trim(),
      spotify: spotify.trim(),
      customLinks: customLinks.filter(link => link.url.trim() !== ''),
      interests: extractInterests(instagram, spotify) // Mock: extract interests from social media
    };
    onSocialMediaChange(updated);
  };

  const extractInterests = (ig, sp) => {
    // Mock function - in production, would use APIs to fetch interests
    const interests = [];
    if (ig) interests.push('Instagram User');
    if (sp) interests.push('Music Lover');
    return interests;
  };

  const addCustomLink = () => {
    setCustomLinks([...customLinks, { platform: '', url: '' }]);
  };

  const updateCustomLink = (index, field, value) => {
    const updated = [...customLinks];
    updated[index] = { ...updated[index], [field]: value };
    setCustomLinks(updated);
  };

  const removeCustomLink = (index) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect Your Social Media</h3>
        <p className="text-sm text-gray-600 mb-6">
          Linking your social media helps others discover shared interests and adds authenticity to your profile.
        </p>
      </div>

      {/* Instagram */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <PhotoIcon className="w-5 h-5 text-pink-500" />
          <span className="font-medium text-gray-700">Instagram</span>
          {instagram && (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          )}
        </label>
        <Input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="@yourusername"
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter your Instagram username (without @)
        </p>
      </div>

      {/* Spotify */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <SpeakerWaveIcon className="w-5 h-5 text-green-500" />
          <span className="font-medium text-gray-700">Spotify</span>
          {spotify && (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          )}
        </label>
        <Input
          type="text"
          value={spotify}
          onChange={(e) => setSpotify(e.target.value)}
          placeholder="Spotify profile URL or username"
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Share your music taste and discover matches with similar preferences
        </p>
      </div>

      {/* Custom Links */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <PaperClipIcon className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Other Links</span>
        </label>
        {customLinks.map((link, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              type="text"
              value={link.platform}
              onChange={(e) => updateCustomLink(index, 'platform', e.target.value)}
              placeholder="Platform name"
              className="flex-1"
            />
            <Input
              type="url"
              value={link.url}
              onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
              placeholder="URL"
              className="flex-2"
            />
            <button
              onClick={() => removeCustomLink(index)}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
            >
              Remove
            </button>
          </div>
        ))}
        <Button
          onClick={addCustomLink}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          + Add Link
        </Button>
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Social Media Links
      </Button>
    </div>
  );
}

