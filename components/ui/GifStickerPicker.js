'use client';

import { useState, useEffect } from 'react';
import { FaceSmileIcon, PhotoIcon } from '@heroicons/react/24/outline';

/**
 * GIF and Sticker Picker Component
 * Integrates with Giphy API for GIFs and provides sticker support
 */
export default function GifStickerPicker({ onSelect, onClose }) {
  const [activeTab, setActiveTab] = useState('gif'); // 'gif' or 'sticker'
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trendingGifs, setTrendingGifs] = useState([]);

  // Mock GIF data (in production, use Giphy API)
  const mockGifs = [
    { id: '1', url: 'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif', title: 'Hello' },
    { id: '2', url: 'https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif', title: 'Wave' },
    { id: '3', url: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif', title: 'Love' },
    { id: '4', url: 'https://media.giphy.com/media/3o7abld2XWZqgR2z7W/giphy.gif', title: 'Happy' },
    { id: '5', url: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif', title: 'Excited' },
    { id: '6', url: 'https://media.giphy.com/media/3o7aD2saalvLx2Z7Go/giphy.gif', title: 'Thumbs Up' },
  ];

  const stickers = [
    { id: 's1', emoji: '😊', label: 'Happy' },
    { id: 's2', emoji: '❤️', label: 'Love' },
    { id: 's3', emoji: '🔥', label: 'Fire' },
    { id: 's4', emoji: '👍', label: 'Thumbs Up' },
    { id: 's5', emoji: '🎉', label: 'Celebrate' },
    { id: 's6', emoji: '💯', label: 'Perfect' },
    { id: 's7', emoji: '😍', label: 'Heart Eyes' },
    { id: 's8', emoji: '✨', label: 'Sparkles' },
    { id: 's9', emoji: '🌟', label: 'Star' },
    { id: 's10', emoji: '💪', label: 'Strong' },
  ];

  useEffect(() => {
    // Load trending GIFs
    setTrendingGifs(mockGifs);
    setGifs(mockGifs);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      // In production, call Giphy API
      // For now, filter mock data
      const filtered = mockGifs.filter(gif => 
        gif.title.toLowerCase().includes(query.toLowerCase())
      );
      setGifs(filtered);
    } else {
      setGifs(trendingGifs);
    }
  };

  const handleSelectGif = (gif) => {
    if (onSelect) {
      onSelect({
        type: 'gif',
        url: gif.url,
        title: gif.title
      });
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSelectSticker = (sticker) => {
    if (onSelect) {
      onSelect({
        type: 'sticker',
        emoji: sticker.emoji,
        label: sticker.label
      });
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-xl p-4" style={{ width: '400px', maxHeight: '500px' }}>
      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('gif')}
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === 'gif'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <PhotoIcon className="w-5 h-5 inline mr-2" />
          GIFs
        </button>
        <button
          onClick={() => setActiveTab('sticker')}
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === 'sticker'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FaceSmileIcon className="w-5 h-5 inline mr-2" />
          Stickers
        </button>
      </div>

      {/* Search */}
      {activeTab === 'gif' && (
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search GIFs..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Content */}
      <div className="overflow-y-auto" style={{ maxHeight: '350px' }}>
        {activeTab === 'gif' ? (
          <div className="grid grid-cols-2 gap-2">
            {gifs.map((gif) => (
              <button
                key={gif.id}
                onClick={() => handleSelectGif(gif)}
                className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
              >
                <img
                  src={gif.url}
                  alt={gif.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {gifs.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No GIFs found
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-3">
            {stickers.map((sticker) => (
              <button
                key={sticker.id}
                onClick={() => handleSelectSticker(sticker)}
                className="p-3 rounded-lg hover:bg-gray-100 transition-all text-3xl"
                title={sticker.label}
              >
                {sticker.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Note */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        {activeTab === 'gif' 
          ? 'Powered by Giphy (mock data in demo)'
          : 'Select a sticker to send'
        }
      </p>
    </div>
  );
}

