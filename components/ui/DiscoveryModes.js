'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, SparklesIcon, ClockIcon } from '@heroicons/react/24/outline';
import Card from './Card';
import Button from './Button';

/**
 * DiscoveryModes Component
 * Provides different modes for discovering profiles
 */
export default function DiscoveryModes({ currentMode, onModeChange }) {
  const modes = [
    {
      id: 'discover',
      name: 'Discover',
      icon: MagnifyingGlassIcon,
      description: 'Algorithm-based matching with compatibility scores',
      color: 'primary'
    },
    {
      id: 'explore',
      name: 'Explore',
      icon: SparklesIcon,
      description: 'Browse all profiles without filters',
      color: 'accent'
    },
    {
      id: 'speed',
      name: 'Speed Dating',
      icon: ClockIcon,
      description: 'Quick matches - see profiles for 30 seconds each',
      color: 'secondary'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Discovery Mode</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isActive
                  ? `border-${mode.color}-500 bg-${mode.color}-50`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-6 h-6 ${isActive ? `text-${mode.color}-600` : 'text-gray-600'}`} />
                <h4 className={`font-semibold ${isActive ? `text-${mode.color}-900` : 'text-gray-900'}`}>
                  {mode.name}
                </h4>
              </div>
              <p className="text-sm text-gray-600">{mode.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

