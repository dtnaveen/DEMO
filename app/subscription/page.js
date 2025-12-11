'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, getAllUsers, setAllUsers } from '@/lib/localStorage';
import { isPremiumUser, getTierPricing, SUBSCRIPTION_TIERS, getUserSubscriptionTier } from '@/lib/subscription';
import { FEATURE_COMPARISON, getUpgradeBenefits } from '@/lib/featureComparison';
import { upgradeSubscription } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { showToast } from '@/utils/helpers';
import { CheckIcon, XMarkIcon, LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function SubscriptionPage() {
  const router = useRouter();
  const [currentUser, setCurrentUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUserState(user);
    setLoading(false);
  }, [router]);

  const handleUpgrade = async (tier) => {
    if (!currentUser) return;
    
    try {
      // Upgrade works offline - no API call needed
      const result = await upgradeSubscription(tier).catch(() => {
        // If API fails, still upgrade locally
        return { success: true, tier };
      });
      
      if (!result || !result.success) {
        showToast('Upgrade failed. Please try again.', 'error');
        return;
      }
      
      const upgradedUser = {
        ...currentUser,
        subscriptionTier: tier,
        premiumSince: new Date().toISOString()
      };
      
      const allUsers = getAllUsers();
      const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
      if (userIndex >= 0) {
        allUsers[userIndex] = { ...allUsers[userIndex], ...upgradedUser };
        setAllUsers(allUsers);
      }
      
      const { password, ...userWithoutPassword } = upgradedUser;
      setCurrentUser(userWithoutPassword);
      setCurrentUserState(userWithoutPassword);
      
      const tierNames = { [SUBSCRIPTION_TIERS.BASIC]: 'Basic', [SUBSCRIPTION_TIERS.PLUS]: 'Plus', [SUBSCRIPTION_TIERS.VIP]: 'VIP' };
      showToast(`🎉 Welcome to ${tierNames[tier]}! Enjoy all premium features!`, 'success');
      
      setTimeout(() => {
        router.push('/discover');
      }, 1500);
    } catch (error) {
      showToast('Failed to upgrade subscription', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isPremium = isPremiumUser(currentUser);
  const currentTier = getUserSubscriptionTier(currentUser);
  const freeFeatures = FEATURE_COMPARISON.FREE;
  const basicFeatures = FEATURE_COMPARISON.BASIC;
  const plusFeatures = FEATURE_COMPARISON.PLUS;
  const vipFeatures = FEATURE_COMPARISON.VIP;

  // Get all unique features for comparison
  const allFeatureKeys = new Set([
    ...Object.keys(freeFeatures.features),
    ...Object.keys(basicFeatures.features),
    ...Object.keys(plusFeatures.features),
    ...Object.keys(vipFeatures.features),
  ]);

  const FeatureRow = ({ featureKey, featureName, icon }) => {
    const free = freeFeatures.features[featureKey];
    const basic = basicFeatures.features[featureKey];
    const plus = plusFeatures.features[featureKey];
    const vip = vipFeatures.features[featureKey];
    
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="font-medium text-gray-900">{featureName}</span>
          </div>
        </td>
        <td className="p-4 text-center">
          {free?.value ? (
            <CheckIcon className="w-6 h-6 text-green-600 mx-auto" />
          ) : free?.value === false ? (
            <XMarkIcon className="w-6 h-6 text-gray-300 mx-auto" />
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </td>
        <td className="p-4 text-center">
          {basic?.value ? (
            <CheckIcon className="w-6 h-6 text-blue-600 mx-auto" />
          ) : basic?.value === false ? (
            <XMarkIcon className="w-6 h-6 text-gray-300 mx-auto" />
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </td>
        <td className="p-4 text-center">
          {plus?.value ? (
            <CheckIcon className="w-6 h-6 text-purple-600 mx-auto" />
          ) : plus?.value === false ? (
            <XMarkIcon className="w-6 h-6 text-gray-300 mx-auto" />
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </td>
        <td className="p-4 text-center">
          {vip?.value ? (
            <CheckIcon className="w-6 h-6 text-yellow-600 mx-auto" />
          ) : vip?.value === false ? (
            <XMarkIcon className="w-6 h-6 text-gray-300 mx-auto" />
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            {isPremium ? (
              <span className="text-gradient">⭐ You're Premium!</span>
            ) : (
              <span className="text-gradient">Choose Your Plan</span>
            )}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isPremium 
              ? 'You have access to all premium features. Thank you for being a premium member!'
              : 'Compare plans and find the perfect fit for your dating journey'
            }
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Free Plan */}
          <Card className={`p-6 relative ${currentTier === SUBSCRIPTION_TIERS.FREE ? 'ring-2 ring-primary-500' : ''}`}>
            {currentTier === SUBSCRIPTION_TIERS.FREE && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                CURRENT
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-black text-gray-900 mb-1">$0</div>
              <div className="text-sm text-gray-600">Forever</div>
            </div>
            <ul className="space-y-2 mb-6 text-sm">
              {freeFeatures.benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button 
              variant={currentTier === SUBSCRIPTION_TIERS.FREE ? "ghost" : "outline"}
              className="w-full"
              disabled={currentTier === SUBSCRIPTION_TIERS.FREE}
            >
              {currentTier === SUBSCRIPTION_TIERS.FREE ? 'Current Plan' : 'Free Forever'}
            </Button>
          </Card>

          {/* Basic Plan */}
          <Card className={`p-6 relative ${currentTier === SUBSCRIPTION_TIERS.BASIC ? 'ring-2 ring-blue-500' : ''}`}>
            {currentTier === SUBSCRIPTION_TIERS.BASIC && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                CURRENT
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <div className="text-4xl font-black text-blue-600 mb-1">${basicFeatures.price}</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
            <ul className="space-y-2 mb-6 text-sm">
              {basicFeatures.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button 
              variant={currentTier === SUBSCRIPTION_TIERS.BASIC ? "ghost" : "primary"}
              className="w-full"
              onClick={() => handleUpgrade(SUBSCRIPTION_TIERS.BASIC)}
              disabled={currentTier === SUBSCRIPTION_TIERS.BASIC}
            >
              {currentTier === SUBSCRIPTION_TIERS.BASIC ? 'Current Plan' : 'Upgrade to Basic'}
            </Button>
          </Card>

          {/* Plus Plan */}
          <Card className={`p-6 relative border-2 border-purple-400 ${currentTier === SUBSCRIPTION_TIERS.PLUS ? 'ring-2 ring-purple-500' : ''}`}>
            <div className="absolute -top-3 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              POPULAR
            </div>
            {currentTier === SUBSCRIPTION_TIERS.PLUS && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                CURRENT
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Plus</h3>
              <div className="text-4xl font-black text-purple-600 mb-1">${plusFeatures.price}</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
            <ul className="space-y-2 mb-6 text-sm">
              {plusFeatures.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckIcon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button 
              variant="premium"
              className="w-full"
              onClick={() => handleUpgrade(SUBSCRIPTION_TIERS.PLUS)}
              disabled={currentTier === SUBSCRIPTION_TIERS.PLUS}
            >
              {currentTier === SUBSCRIPTION_TIERS.PLUS ? 'Current Plan' : 'Upgrade to Plus'}
            </Button>
          </Card>

          {/* VIP Plan */}
          <Card className={`p-6 relative border-2 border-yellow-400 ${currentTier === SUBSCRIPTION_TIERS.VIP ? 'ring-2 ring-yellow-500' : ''}`}>
            <div className="absolute -top-3 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              VIP
            </div>
            {currentTier === SUBSCRIPTION_TIERS.VIP && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                CURRENT
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">VIP</h3>
              <div className="text-4xl font-black text-yellow-600 mb-1">${vipFeatures.price}</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
            <ul className="space-y-2 mb-6 text-sm">
              {vipFeatures.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <span className="text-yellow-600">⭐</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button 
              variant="premium"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500"
              onClick={() => handleUpgrade(SUBSCRIPTION_TIERS.VIP)}
              disabled={currentTier === SUBSCRIPTION_TIERS.VIP}
            >
              {currentTier === SUBSCRIPTION_TIERS.VIP ? 'Current Plan' : 'Upgrade to VIP'}
            </Button>
          </Card>
        </div>

        {/* Detailed Feature Comparison Table */}
        {!isPremium && (
          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Detailed Feature Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="p-4 text-left font-bold text-gray-900">Feature</th>
                    <th className="p-4 text-center font-bold text-gray-900">Free</th>
                    <th className="p-4 text-center font-bold text-blue-600">Basic</th>
                    <th className="p-4 text-center font-bold text-purple-600">Plus</th>
                    <th className="p-4 text-center font-bold text-yellow-600">VIP</th>
                  </tr>
                </thead>
                <tbody>
                  <FeatureRow featureKey="unlimitedLikes" featureName="Unlimited Likes" icon="∞" />
                  <FeatureRow featureKey="dailyLikes" featureName="10 Likes per Day" icon="❤️" />
                  <FeatureRow featureKey="unlimitedPasses" featureName="Unlimited Passes" icon="👋" />
                  <FeatureRow featureKey="basicFilters" featureName="Basic Filters" icon="🔍" />
                  <FeatureRow featureKey="advancedFilters" featureName="Advanced Filters" icon="🔍" />
                  <FeatureRow featureKey="seeWhoLiked" featureName="See Who Liked You" icon="👀" />
                  <FeatureRow featureKey="readReceipts" featureName="Read Receipts" icon="✓" />
                  <FeatureRow featureKey="rewinds" featureName="Rewinds" icon="↩️" />
                  <FeatureRow featureKey="unlimitedRewinds" featureName="Unlimited Rewinds" icon="↩️" />
                  <FeatureRow featureKey="profileBoost" featureName="Profile Boost" icon="🚀" />
                  <FeatureRow featureKey="priorityMatching" featureName="Priority Matching" icon="⭐" />
                  <FeatureRow featureKey="adFree" featureName="Ad-Free Experience" icon="✨" />
                  <FeatureRow featureKey="matchBreakdown" featureName="Match Breakdown" icon="📊" />
                  <FeatureRow featureKey="viewProfiles" featureName="View All Profiles" icon="👁️" />
                  <FeatureRow featureKey="sendMessages" featureName="Send Messages" icon="💬" />
                  <FeatureRow featureKey="receiveMessages" featureName="Receive Messages" icon="📨" />
                  <FeatureRow featureKey="uploadPhotos" featureName="Upload Photos" icon="📸" />
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Free vs Premium Benefits */}
        {!isPremium && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-gray-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🆓</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Free Plan Benefits</h3>
              </div>
              <ul className="space-y-3">
                {freeFeatures.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Limitations:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {freeFeatures.limitations.map((limitation, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <XMarkIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Premium Benefits</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-semibold">Unlimited Likes - No daily limits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-semibold">See Who Liked You - Before matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-semibold">Advanced Filters - Find exactly what you want</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-semibold">Read Receipts - Know when messages are read</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-semibold">Unlimited Rewinds - Undo any pass</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-semibold">Profile Boost - Get seen first</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-semibold">Ad-Free Experience - No interruptions</span>
                </li>
              </ul>
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => router.push('/subscription')}
              >
                View All Premium Plans
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
