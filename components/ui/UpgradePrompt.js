'use client';

import { useState } from 'react';
import Link from 'next/link';
import { XMarkIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import Card from './Card';

/**
 * Upgrade Prompt Component
 * Shows upgrade prompt for premium features
 */
export default function UpgradePrompt({ 
  feature,
  benefits = [],
  onClose,
  variant = 'banner' // 'banner', 'modal', 'inline'
}) {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (variant === 'banner') {
    return (
      <Card className="p-4 mb-6 bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{feature} is a Premium Feature</h3>
              <p className="text-sm text-gray-600">Upgrade to unlock this and more premium features</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/subscription">
              <Button variant="primary" size="sm">
                Upgrade Now
              </Button>
            </Link>
            {onClose && (
              <button onClick={handleClose} className="p-1 hover:bg-gray-200 rounded">
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </Card>
    );
  }
  
  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full p-6 relative">
          {onClose && (
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          )}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unlock Premium Features</h2>
            <p className="text-gray-600">{feature} is available with Premium</p>
          </div>
          
          {benefits.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">You'll also get:</h3>
              <ul className="space-y-2">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <Link href="/subscription" className="block">
            <Button variant="primary" className="w-full" size="lg">
              View Premium Plans
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }
  
  // Inline variant
  return (
    <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <SparklesIcon className="w-5 h-5 text-primary-600" />
        <span className="font-semibold text-gray-900">Premium Feature</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{feature} is available with Premium subscription.</p>
      <Link href="/subscription">
        <Button variant="primary" size="sm">
          Upgrade Now
        </Button>
      </Link>
    </div>
  );
}

