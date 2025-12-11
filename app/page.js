'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Logo from '@/components/ui/Logo';
import { getCurrentUser, checkStorageSupport } from '@/lib/localStorage';
import { initializeMockData } from '@/lib/mockData';
import { setupRanjithUser } from '@/lib/userSetup';
import { createMatchingProfiles } from '@/lib/createMatchingProfiles';
import { sendAutoMessagesFromSarah } from '@/lib/autoMessaging';

function LandingPageContent() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      router.push('/discover');
      return;
    }
    
    if (!checkStorageSupport()) {
      alert('Your browser does not support localStorage. Please use a modern browser.');
    }
    
    initializeMockData();
    
    setTimeout(() => {
      setupRanjithUser();
    }, 100);
    
    setTimeout(() => {
      createMatchingProfiles(3);
      setTimeout(() => {
        sendAutoMessagesFromSarah();
      }, 300);
    }, 200);
  }, [router]);
  
  const handleGetStarted = () => {
    router.push('/onboard');
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 animate-gradient-shift"></div>
      
      {/* Floating orbs - Client-only to prevent hydration mismatch */}
      {isMounted && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 floating"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 floating animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 floating animation-delay-4000"></div>
          <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 floating animation-delay-6000"></div>
        </div>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Logo with animation */}
          <div className="flex justify-center mb-12 animate-pulse-slow">
            <div className="relative">
              <Logo size="xl" variant="white" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            </div>
          </div>
          
          {/* Main heading with trendy typography */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-none">
            <span className="block mb-2 text-glow">Find Your</span>
            <span className="block text-gradient bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Perfect Vibe
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl lg:text-4xl text-white/95 mb-4 max-w-3xl mx-auto font-light leading-tight">
            Match with people who
            <span className="block mt-2 font-bold text-yellow-200">actually get you</span>
          </p>
          
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Value-based matching • Real connections • No BS
          </p>
          
          {/* CTA Buttons with modern design */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={handleGetStarted}
              className="px-12 py-5 bg-white/10 backdrop-blur-xl text-white text-xl font-bold rounded-3xl border-2 border-white/30 hover:border-white/60 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 shadow-2xl"
            >
              Get Started Free
            </button>
            
            <Link 
              href="/login"
              className="px-12 py-5 bg-white/10 backdrop-blur-xl text-white text-xl font-bold rounded-3xl border-2 border-white/30 hover:border-white/60 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 shadow-2xl"
            >
              Already have an account?
            </Link>
          </div>
          
          {/* Feature cards with trendy design */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-20 max-w-6xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative glass-effect rounded-3xl p-8 text-white border-2 border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <div className="text-6xl mb-6 floating">💝</div>
                <h3 className="text-2xl font-black mb-4 font-trendy">Value-Based</h3>
                <p className="text-white/90 leading-relaxed text-lg">
                  Match on what actually matters - your core values and relationship goals
                </p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative glass-effect rounded-3xl p-8 text-white border-2 border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <div className="text-6xl mb-6 floating animation-delay-2000">🎯</div>
                <h3 className="text-2xl font-black mb-4 font-trendy">Smart Matching</h3>
                <p className="text-white/90 leading-relaxed text-lg">
                  AI-powered algorithm finds your perfect match based on compatibility
                </p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative glass-effect rounded-3xl p-8 text-white border-2 border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                <div className="text-6xl mb-6 floating animation-delay-4000">🚀</div>
                <h3 className="text-2xl font-black mb-4 font-trendy">Real Connections</h3>
                <p className="text-white/90 leading-relaxed text-lg">
                  Build meaningful relationships, not just swipe through profiles
                </p>
              </div>
            </div>
          </div>
          
          {/* Social proof / Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-black text-white mb-2">10K+</div>
              <div className="text-white/80 font-semibold">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-white mb-2">500+</div>
              <div className="text-white/80 font-semibold">Matches Daily</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-white mb-2">95%</div>
              <div className="text-white/80 font-semibold">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
        </svg>
      </div>
    </div>
  );
}

// Disable SSR to prevent hydration mismatches
const LandingPage = dynamic(() => Promise.resolve(LandingPageContent), {
  ssr: false
});

export default LandingPage;
