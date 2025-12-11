'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  QuestionMarkCircleIcon,
  UserCircleIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

// Move sections outside component to prevent hydration mismatch
// This ensures the array and JSX content are stable between server and client renders
const HELP_SECTIONS = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpenIcon,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">Creating Your Profile</h3>
            <p className="text-gray-600 mb-2">
              To get started with VibeMatch, you'll need to create a profile:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
              <li>Click "Get Started" on the landing page</li>
              <li>Enter your basic information (name, age, gender, location)</li>
              <li>Answer value-based questions about your relationship preferences</li>
              <li>Answer content preference questions tailored to your age group</li>
              <li>Set your matching preferences and filters</li>
            </ol>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Your First Match</h3>
            <p className="text-gray-600">
              Once your profile is complete, you can start browsing profiles on the Discover page. 
              Like profiles that interest you, and if they like you back, you'll have a match!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      title: 'Profile Management',
      icon: UserCircleIcon,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">Viewing Your Profile</h3>
            <p className="text-gray-600 mb-2">
              To view or edit your profile:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
              <li>Click on "Profile" in the navigation bar</li>
              <li>View your match statistics and profile information</li>
              <li>Edit any section by clicking the edit button</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Updating Your Profile</h3>
            <p className="text-gray-600">
              You can update your profile at any time. Changes to your answers may affect your 
              match scores with other users, so keep your profile up to date!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'matching',
      title: 'Finding Matches',
      icon: HeartIcon,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">How Matching Works</h3>
            <p className="text-gray-600 mb-2">
              VibeMatch uses a smart algorithm to calculate compatibility:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
              <li><strong>Values Alignment (50%):</strong> How well your relationship values align</li>
              <li><strong>Content Preferences (30%):</strong> Shared interests and content preferences</li>
              <li><strong>Lifestyle Compatibility (20%):</strong> Age, location, and lifestyle factors</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Using Filters</h3>
            <p className="text-gray-600">
              Use the filter panel on the Discover page to narrow down your search. Free users 
              have access to basic filters, while Premium users can use advanced filters for 
              more specific matching.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Daily Like Limits</h3>
            <p className="text-gray-600">
              Free users can like up to 10 profiles per day. Premium users have unlimited likes. 
              Your daily limit resets at midnight.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'messaging',
      title: 'Messaging',
      icon: ChatBubbleLeftIcon,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">Starting a Conversation</h3>
            <p className="text-gray-600 mb-2">
              Once you have a mutual match, you can start messaging:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
              <li>Go to the Matches page to see your mutual matches</li>
              <li>Click "Message" on any match to start a conversation</li>
              <li>Use AI-generated icebreaker prompts or write your own message</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">AI Bot Conversations</h3>
            <p className="text-gray-600">
              Some profiles are AI bots that can have conversations with you. You can customize 
              the bot's personality and chat style in the Bot Profile settings.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Read Receipts</h3>
            <p className="text-gray-600">
              Premium users can see when their messages have been read (double checkmark ✓✓). 
              Free users see a single checkmark (✓) when messages are sent.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'premium',
      title: 'Premium Features',
      icon: CreditCardIcon,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">Premium Benefits</h3>
            <p className="text-gray-600 mb-2">
              Upgrade to Premium to unlock:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
              <li>Unlimited likes per day</li>
              <li>See who liked you</li>
              <li>Advanced filters for better matching</li>
              <li>Read receipts (know when messages are read)</li>
              <li>Unlimited rewinds</li>
              <li>Profile boost (get seen by more people)</li>
              <li>Priority matching</li>
              <li>Ad-free experience</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">How to Upgrade</h3>
            <p className="text-gray-600">
              Click on the "Premium" button in the navigation bar to view all premium features 
              and upgrade your account.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'bot-settings',
      title: 'Bot Settings',
      icon: Cog6ToothIcon,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">Customizing AI Bot</h3>
            <p className="text-gray-600 mb-2">
              You can customize the AI bot's personality and behavior:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
              <li>Edit basic information (name, age, gender, location)</li>
              <li>Set personality traits and response style</li>
              <li>Adjust sexual chat level (if applicable)</li>
              <li>Configure matching preferences</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Accessing Bot Settings</h3>
            <p className="text-gray-600">
              While chatting with an AI bot, click the "Edit Bot" button in the chat header, 
              or navigate to the Bot Profile page from the navigation menu.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      icon: QuestionMarkCircleIcon,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Is my data safe?</h3>
            <p className="text-gray-600">
              Yes! All your data is stored locally in your browser. We don't send any data to 
              external servers. However, this means your data is specific to the browser you're using.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Can I use VibeMatch on multiple devices?</h3>
            <p className="text-gray-600">
              Currently, VibeMatch stores data locally in your browser. To use it on another device, 
              you'll need to create a new profile on that device.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">What happens if I clear my browser data?</h3>
            <p className="text-gray-600">
              If you clear your browser's localStorage, all your profile data, matches, and 
              conversations will be lost. Make sure to back up important information if needed.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">How do I report a problem?</h3>
            <p className="text-gray-600">
              If you encounter any issues, please check the browser console for error messages. 
              For support, you can contact the development team.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Can I delete my account?</h3>
            <p className="text-gray-600">
              Since all data is stored locally, you can clear your browser's localStorage to 
              remove all your data. Alternatively, you can manually delete specific data using 
              browser developer tools.
            </p>
          </div>
        </div>
      )
    }
];

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by ensuring component only renders after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Help & Documentation</h1>
            <p className="text-gray-600 text-lg">Everything you need to know about VibeMatch</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Help & Documentation</h1>
          <p className="text-gray-600 text-lg">Everything you need to know about VibeMatch</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <nav className="space-y-2">
                {HELP_SECTIONS.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Card>
              <div className="prose max-w-none">
                {HELP_SECTIONS.find(s => s.id === activeSection)?.content}
              </div>
            </Card>

            {/* Quick Links */}
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Link href="/discover">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <MagnifyingGlassIcon className="w-8 h-8 text-primary-500" />
                    <div>
                      <h3 className="font-bold">Start Discovering</h3>
                      <p className="text-sm text-gray-600">Browse profiles and find matches</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link href="/subscription">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <CreditCardIcon className="w-8 h-8 text-accent-500" />
                    <div>
                      <h3 className="font-bold">Go Premium</h3>
                      <p className="text-sm text-gray-600">Unlock all features</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

