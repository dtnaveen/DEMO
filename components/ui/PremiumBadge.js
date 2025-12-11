'use client';

import { LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { isPremiumUser } from '@/lib/subscription';

/**
 * Premium Badge Component
 * Shows premium lock/badge for premium-only features
 */
export default function PremiumBadge({ 
  feature, 
  user, 
  showUpgrade = true,
  size = 'sm',
  variant = 'lock' // 'lock' or 'badge'
}) {
  const isPremium = isPremiumUser(user);
  
  if (isPremium) {
    if (variant === 'badge') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-bold rounded-full">
          <SparklesIcon className="w-3 h-3" />
          Premium
        </span>
      );
    }
    return null; // Don't show lock for premium users
  }
  
  if (variant === 'lock') {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10 backdrop-blur-sm">
          <div className="text-center">
            <LockClosedIcon className={`${size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'} text-white mx-auto mb-2`} />
            {showUpgrade && (
              <Link 
                href="/subscription"
                className="text-white text-xs font-semibold hover:underline"
              >
                Upgrade to Unlock
              </Link>
            )}
          </div>
        </div>
        {feature}
      </div>
    );
  }
  
  return (
    <Link 
      href="/subscription"
      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full hover:bg-gray-200 transition-colors"
    >
      <LockClosedIcon className="w-3 h-3" />
      Premium
    </Link>
  );
}

