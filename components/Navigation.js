'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  ChatBubbleLeftIcon, 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  HeartIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Logo from '@/components/ui/Logo';
import { useState, useEffect } from 'react';
import { getCurrentUser, clearCurrentUser } from '@/lib/localStorage';
import { showToast } from '@/utils/helpers';
import { isPremiumUser } from '@/lib/subscription';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Only check for user on client side after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setCurrentUser(getCurrentUser());
  }, []);
  
  // Update user when pathname changes (in case user logs in/out)
  useEffect(() => {
    if (isMounted) {
      setCurrentUser(getCurrentUser());
    }
  }, [pathname, isMounted]);
  
  // Don't show navigation on landing/onboarding/login pages
  // Check this first to avoid hydration issues (pathname is available on both server and client)
  if (pathname === '/' || pathname === '/onboard' || pathname === '/login') {
    return null;
  }
  
  // For all other pages, always render the nav structure to avoid hydration mismatch
  // The content inside will be conditional, but the structure stays the same
  if (!isMounted || !currentUser) {
    // Return empty nav structure that matches the actual nav
    // This ensures server and client render the same structure
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b border-white/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="w-32 h-8"></div>
            <div className="hidden md:flex items-center space-x-2">
              {/* Empty space to match nav structure */}
            </div>
            <div className="w-8 h-8"></div>
          </div>
        </div>
      </nav>
    );
  }
  
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? Your chats and matches will be saved.')) {
      clearCurrentUser();
      showToast('Logged out successfully', 'success');
      router.push('/');
      setIsMenuOpen(false);
    }
  };
  
  const isPremium = isPremiumUser(currentUser);
  
    const isAdmin = currentUser?.role === 'admin' || currentUser?.email === 'admin@vibematch.com';
    
    const navItems = [
      { href: '/discover', label: 'Discover', icon: MagnifyingGlassIcon },
      { href: '/matches', label: 'Matches', icon: HeartIcon },
      { href: '/messages', label: 'Messages', icon: ChatBubbleLeftIcon },
      { href: '/groups', label: 'Groups', icon: UserGroupIcon },
      { href: '/events', label: 'Events', icon: CalendarIcon },
      { href: '/forums', label: 'Forums', icon: ChatBubbleLeftRightIcon },
      { href: '/analytics', label: 'Analytics', icon: ChartBarIcon },
      { href: '/profile', label: 'Profile', icon: UserCircleIcon },
      { href: '/help', label: 'Help', icon: QuestionMarkCircleIcon },
    ];
    
    if (isAdmin) {
      navItems.push({ href: '/admin', label: 'Admin', icon: ShieldCheckIcon });
    }
  
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b border-white/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/discover" className="group">
            <Logo size="md" className="group-hover:scale-105 transition-transform duration-300" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === '/discover' && pathname.startsWith('/discover'));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 font-bold ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-neon scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:via-pink-50 hover:to-blue-50 hover:scale-105'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-lg opacity-50 -z-10"></div>
                  )}
                </Link>
              );
            })}
            {!isPremium && (
              <Link
                href="/subscription"
                className="group relative flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-2xl hover:shadow-neon transform hover:scale-110 transition-all duration-300 font-black overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" />
                  <span>Premium</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}
            {isPremium && (
              <Link
                href="/subscription"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-100 to-primary-100 text-accent-700 border-2 border-accent-200 hover:border-accent-300 transition-all duration-300 font-bold"
              >
                <span className="text-lg">⭐</span>
                <span>Premium</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            {!isPremium && (
              <Link
                href="/subscription"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold"
              >
                <span>⭐</span>
                <span>Premium</span>
              </Link>
            )}
            {isPremium && (
              <Link
                href="/subscription"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
              >
                <span>⭐</span>
                <span>Premium</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
