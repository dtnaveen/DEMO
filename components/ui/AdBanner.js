'use client';

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { trackAdImpression, trackAdClick } from '@/lib/adTracking';
import { getCurrentUser } from '@/lib/localStorage';

/**
 * Ad Banner Component
 * Displays ads between profiles for free users
 * Premium users won't see this component
 */
export default function AdBanner({ 
  onClose,
  className = '',
  adId = 'premium-upgrade-banner'
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const impressionTracked = useRef(false);
  
  // Sample ad content - In production, this would come from an ad network
  const adContent = {
    title: 'Upgrade to Premium',
    description: 'Get unlimited likes, see who liked you, and enjoy an ad-free experience!',
    cta: 'Go Premium',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
    link: '/subscription',
    sponsored: true
  };
  
  // Track impression when ad becomes visible
  useEffect(() => {
    if (isVisible && !impressionTracked.current) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        trackAdImpression(adId, currentUser.id, 'banner');
        impressionTracked.current = true;
      }
    }
  }, [isVisible, adId]);
  
  const handleAdClick = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      trackAdClick(adId, currentUser.id, 'banner', adContent.link);
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`relative group ${className}`}
      style={{
        animationDelay: '0ms',
      }}
    >
      {/* Ad Container with trendy design */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-yellow-300/30 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
        {/* Sponsored Badge */}
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-4 py-1.5 shadow-lg">
          <div className="flex items-center gap-1.5">
            <SparklesIcon className="w-4 h-4 text-white" />
            <span className="text-xs font-black text-white uppercase tracking-wider">Sponsored</span>
          </div>
        </div>
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose && onClose();
            }}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg hover:scale-110"
            aria-label="Close ad"
          >
            <XMarkIcon className="w-5 h-5 text-gray-700" />
          </button>
        )}
        
        {/* Ad Content */}
        <Link 
          href={adContent.link}
          onClick={handleAdClick}
          className="block relative h-[300px] overflow-hidden group"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
            {adContent.image && (
              <img 
                src={adContent.image}
                alt={adContent.title}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                } group-hover:scale-110`}
                onLoad={() => setImageLoaded(true)}
              />
            )}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 animate-pulse"></div>
            )}
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20"></div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-black text-white mb-2 font-trendy drop-shadow-2xl">
              {adContent.title}
            </h3>
            <p className="text-white/90 text-sm font-semibold mb-4 drop-shadow-lg">
              {adContent.description}
            </p>
            
            {/* CTA Button */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl font-black text-sm shadow-neon hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <span>{adContent.cta}</span>
              <SparklesIcon className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </div>
      
      {/* Ad Label */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500 font-semibold">Advertisement</p>
      </div>
    </div>
  );
}

/**
 * Alternative Ad Component - Simple Banner Style
 */
export function SimpleAdBanner({ className = '' }) {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  return (
    <div className={`relative ${className}`}>
      <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 rounded-xl p-6 border-2 border-yellow-300/50 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="w-5 h-5 text-yellow-600" />
              <span className="text-xs font-black text-yellow-700 uppercase tracking-wider">Sponsored</span>
            </div>
            <h4 className="text-lg font-black text-gray-900 mb-1">
              Upgrade to Premium
            </h4>
            <p className="text-sm text-gray-700 font-semibold">
              Remove ads and unlock unlimited features
            </p>
          </div>
          <Link 
            href="/subscription"
            className="ml-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-black text-sm hover:shadow-neon transform hover:scale-105 transition-all duration-300"
          >
            Upgrade
          </Link>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500 font-semibold">Advertisement</p>
      </div>
    </div>
  );
}

