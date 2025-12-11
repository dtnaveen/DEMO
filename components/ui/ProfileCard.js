'use client';

import { useState } from 'react';
import { HeartIcon, XMarkIcon, EyeIcon, CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function ProfileCard({ 
  user, 
  matchScore, 
  sharedInterests = [],
  distance = null,
  onLike, 
  onPass, 
  onView,
  className = '' 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const percentage = matchScore?.percentage || 0;
  
  return (
    <div 
      className={`card-swipe group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.02) rotateY(2deg)' : 'scale(1) rotateY(0deg)',
      }}
    >
      {/* Profile Image with trendy overlay */}
      <div className="relative h-[500px] bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 overflow-hidden">
        {user.photoUrl ? (
          <>
            <img 
              src={user.photoUrl} 
              alt={user.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 animate-pulse"></div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center text-white text-6xl font-black shadow-2xl">
              {user.name.charAt(0)}
            </div>
          </div>
        )}
        
        {/* Dynamic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20"></div>
        
        {/* Match Badge - Trendy design */}
        {percentage > 0 && (
          <div className="absolute top-6 right-6 glass-effect rounded-2xl px-6 py-3 shadow-neon border-2 border-white/40 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-yellow-300" />
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{percentage}</span>
                <span className="text-sm font-bold text-white/80">%</span>
              </div>
            </div>
            <div className="text-xs font-bold text-white/70 uppercase tracking-wider mt-1">Match</div>
          </div>
        )}
        
        {/* Verification Badge - Modern design */}
        {user.verified && (
          <div className="absolute top-6 left-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-3 shadow-neon border-2 border-white/40 pulse-glow">
            <CheckBadgeIcon className="w-6 h-6 text-white" />
          </div>
        )}
        
        {/* AI Bot Badge - Trendy */}
        {user.isAIBot && (
          <div className={`absolute ${user.verified ? 'top-20' : 'top-6'} left-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-2xl px-5 py-2.5 shadow-neon border-2 border-white/40 backdrop-blur-xl flex items-center gap-2 pulse-glow`}>
            <span className="text-xl">🤖</span>
            <span className="text-sm font-black text-white uppercase tracking-wider">AI</span>
          </div>
        )}
        
        {/* Profile Info Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-4xl font-black text-white font-trendy drop-shadow-2xl">{user.name}</h3>
            {user.isAIBot && (
              <span className="px-3 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-black rounded-full uppercase tracking-wide shadow-lg">
                AI
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <p className="text-white/90 text-lg font-semibold">
              {user.age}
            </p>
            <span className="text-white/60">•</span>
            <p className="text-white/90 text-lg font-semibold">
              {user.location}
            </p>
            {distance !== null && (
              <>
                <span className="text-white/60">•</span>
                <p className="text-white/90 text-lg font-bold bg-white/20 px-3 py-1 rounded-full">
                  {distance} mi
                </p>
              </>
            )}
          </div>
          
          {/* Shared Interests - Trendy tags */}
          {sharedInterests.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-black text-white/80 mb-2 uppercase tracking-wider">Why you match:</p>
              <div className="flex flex-wrap gap-2">
                {sharedInterests.slice(0, 3).map((interest, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-white/20 backdrop-blur-xl text-white text-sm font-bold rounded-full border border-white/30 shadow-lg"
                  >
                    {interest.answer}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons - Modern swipe-style */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPass && onPass();
              }}
              className="flex-1 group relative px-6 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl hover:bg-red-500 hover:border-red-400 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg"
            >
              <XMarkIcon className="w-8 h-8 text-white mx-auto group-hover:scale-125 transition-transform" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView && onView(user);
              }}
              className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl hover:bg-blue-500 hover:border-blue-400 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <EyeIcon className="w-8 h-8 text-white mx-auto" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike && onLike();
              }}
              className="flex-1 group relative px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 hover:-rotate-12 shadow-neon pulse-glow"
            >
              <HeartSolidIcon className="w-8 h-8 text-white mx-auto group-hover:scale-125 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
