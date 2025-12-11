'use client';

import { useState, useEffect } from 'react';
import Button from './ui/Button';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function OnboardingStep({ 
  step, 
  data, 
  onNext, 
  onPrevious, 
  canGoNext = true,
  children 
}) {
  const isFirstStep = step === 1;
  const isLastStep = step === 6;
  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;
  
  const stepTitles = {
    1: 'Create Your Profile',
    2: 'Age Group',
    3: 'Your Values',
    4: 'Content Preferences',
    5: 'Preferences & Filters',
    6: 'Additional Info'
  };
  
  const stepIcons = {
    1: '✨',
    2: '🎯',
    3: '💝',
    4: '🎨',
    5: '⚙️',
    6: '📝'
  };
  
  const patternUrl = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
  
  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4">
      {/* Trendy animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 -z-10"></div>
      <div 
        className="fixed inset-0 opacity-30 -z-10"
        style={{ backgroundImage: `url('${patternUrl}')` }}
      ></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Progress Section - Trendy Design */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-2xl shadow-2xl pulse-glow">
                {stepIcons[step]}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 font-trendy">
                  {stepTitles[step]}
                </h2>
                <p className="text-sm text-gray-600 font-semibold">
                  Step {step} of {totalSteps}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-gradient bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {Math.round(progress)}%
              </div>
              <p className="text-xs text-gray-600 font-semibold">Complete</p>
            </div>
          </div>
          
          {/* Progress Bar - Modern Design */}
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {[1, 2, 3, 4, 5, 6].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    stepNum < step
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg scale-110'
                      : stepNum === step
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-2xl scale-125 pulse-glow'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNum < step ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    stepNum
                  )}
                </div>
                <span className={`text-xs mt-1 font-semibold ${
                  stepNum <= step ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {stepNum}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Step Content - Glass Morphism Card */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative glass-effect rounded-3xl p-8 md:p-12 border-2 border-white/30 shadow-2xl">
            {children}
          </div>
        </div>
        
        {/* Navigation Buttons - Modern Design */}
        <div className="flex justify-between items-center gap-4">
          <Button
            onClick={onPrevious}
            variant="outline"
            disabled={isFirstStep}
            className="px-8 py-4 text-lg font-bold"
          >
            ← Previous
          </Button>
          
          <div className="flex-1 text-center">
            <p className="text-sm text-gray-600 font-semibold">
              {isLastStep ? 'Almost done!' : 'Continue to next step'}
            </p>
          </div>
          
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            variant="primary"
            className="px-8 py-4 text-lg font-black shadow-2xl hover:shadow-neon transform hover:scale-110 transition-all duration-300"
          >
            {isLastStep ? (
              <>
                <SparklesIcon className="w-5 h-5 inline mr-2" />
                Complete Setup
              </>
            ) : (
              <>
                Next →
              </>
            )}
          </Button>
        </div>
        
        {/* Help Text */}
        {!canGoNext && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Please complete all required fields to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
