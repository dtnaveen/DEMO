'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getAllUsers, getMatches } from '@/lib/localStorage';
import { isAdmin } from '@/lib/adminAuth';
import { getAllMetrics, getMetricsTrend } from '@/lib/adminMetrics';
import { generateTestDataForMetrics } from '@/lib/generateTestData';
// eslint-disable-next-line no-unused-vars
import Card from '@/components/ui/Card';
// eslint-disable-next-line no-unused-vars
import Button from '@/components/ui/Button';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isAdmin(user)) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }

    setCurrentUser(user);
    
    // Generate test data for metrics if needed
    try {
      generateTestDataForMetrics();
    } catch (error) {
      // Error generating test data - silently fail
      setError('Failed to generate test data');
    }
    
    loadMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const loadMetrics = () => {
    try {
      const current = getAllMetrics();
      const previous = JSON.parse(localStorage.getItem('previousMetrics') || 'null');
      
      // Store current as previous for next comparison
      localStorage.setItem('previousMetrics', JSON.stringify(current));
      
      setMetrics({
        current,
        trend: previous ? getMetricsTrend(current, previous) : null,
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load metrics: ' + err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/discover')} variant="primary">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const { current, trend } = metrics;
  const TrendIndicator = ({ value }) => {
    if (!value) return null;
    const isPositive = value > 0;
    const TrendIcon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
    return (
      <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <TrendIcon className="w-4 h-4" />
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  const MetricCard = ({ title, value, icon: Icon, trend, suffix = '', prefix = '' }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-8 h-8 text-primary-600" />}
          <h3 className="text-sm font-semibold text-gray-600 uppercase">{title}</h3>
        </div>
        {trend && <TrendIndicator value={trend} />}
      </div>
      <div className="text-3xl font-black text-gray-900">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Success Metrics & KPIs Overview</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={loadMetrics} variant="outline" size="sm">
                Refresh
              </Button>
              <Button onClick={() => router.push('/discover')} variant="ghost" size="sm">
                Back to App
              </Button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {new Date(current.timestamp).toLocaleString()}
          </div>
        </div>

        {/* User Engagement Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserGroupIcon className="w-6 h-6 text-primary-600" />
            User Engagement Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Daily Active Users"
              value={current.engagement.dailyActiveUsers}
              icon={UserGroupIcon}
              trend={trend?.engagement?.dailyActiveUsers}
            />
            <MetricCard
              title="Monthly Active Users"
              value={current.engagement.monthlyActiveUsers}
              icon={UserGroupIcon}
              trend={trend?.engagement?.monthlyActiveUsers}
            />
            <MetricCard
              title="Match Rate"
              value={current.engagement.matchRate}
              icon={ChartBarIcon}
              trend={trend?.engagement?.matchRate}
              suffix="%"
            />
            <MetricCard
              title="Message Response Rate"
              value={current.engagement.messageResponseRate}
              icon={ChartBarIcon}
              trend={trend?.engagement?.messageResponseRate}
              suffix="%"
            />
            <MetricCard
              title="Video Call Usage"
              value={current.engagement.videoCallUsage}
              icon={ChartBarIcon}
              trend={trend?.engagement?.videoCallUsage}
              suffix="%"
            />
            <MetricCard
              title="Profile Completion Rate"
              value={current.engagement.profileCompletionRate}
              icon={ChartBarIcon}
              trend={trend?.engagement?.profileCompletionRate}
              suffix="%"
            />
          </div>
        </div>

        {/* Business Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            Business Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Premium Conversion Rate"
              value={current.business.premiumConversionRate}
              icon={CurrencyDollarIcon}
              trend={trend?.business?.premiumConversionRate}
              suffix="%"
            />
            <MetricCard
              title="Average Revenue Per User (ARPU)"
              value={current.business.averageRevenuePerUser}
              icon={CurrencyDollarIcon}
              trend={trend?.business?.averageRevenuePerUser}
              prefix="$"
            />
            <MetricCard
              title="Customer Lifetime Value (CLV)"
              value={current.business.customerLifetimeValue}
              icon={CurrencyDollarIcon}
              trend={trend?.business?.customerLifetimeValue}
              prefix="$"
            />
            <MetricCard
              title="Churn Rate"
              value={current.business.churnRate}
              icon={ChartBarIcon}
              trend={trend?.business?.churnRate}
              suffix="%"
            />
            <MetricCard
              title="User Acquisition Cost (CAC)"
              value={current.business.userAcquisitionCost}
              icon={CurrencyDollarIcon}
              prefix="$"
            />
            <MetricCard
              title="ARPU (with Ads)"
              value={current.business.averageRevenuePerUserWithAds || current.business.averageRevenuePerUser}
              icon={CurrencyDollarIcon}
              trend={trend?.business?.averageRevenuePerUserWithAds}
              prefix="$"
            />
          </div>
        </div>

        {/* Ad Revenue Metrics */}
        {current.business.adRevenue !== undefined && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
              Ad Revenue Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Ad Revenue"
                value={current.business.adRevenue || 0}
                icon={CurrencyDollarIcon}
                prefix="$"
              />
              <MetricCard
                title="Ad Impressions"
                value={current.business.adImpressions || 0}
                icon={ChartBarIcon}
              />
              <MetricCard
                title="Ad Clicks"
                value={current.business.adClicks || 0}
                icon={ChartBarIcon}
              />
              <MetricCard
                title="Click-Through Rate"
                value={current.business.adClickThroughRate || 0}
                icon={ChartBarIcon}
                suffix="%"
              />
              <MetricCard
                title="Conversion Rate"
                value={current.business.adConversionRate || 0}
                icon={ChartBarIcon}
                suffix="%"
              />
            </div>
          </div>
        )}

        {/* Quality Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
            Quality Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Relationship Success Rate"
              value={current.quality.relationshipSuccessRate}
              icon={ChartBarIcon}
              trend={trend?.quality?.relationshipSuccessRate}
              suffix="%"
            />
            <MetricCard
              title="User Satisfaction Score"
              value={current.quality.userSatisfactionScore}
              icon={ChartBarIcon}
              trend={trend?.quality?.userSatisfactionScore}
              suffix="%"
            />
            <MetricCard
              title="Safety Incident Rate"
              value={current.quality.safetyIncidentRate}
              icon={ShieldCheckIcon}
              trend={trend?.quality?.safetyIncidentRate}
              suffix="%"
            />
            <MetricCard
              title="Profile Verification Rate"
              value={current.quality.profileVerificationRate}
              icon={ShieldCheckIcon}
              trend={trend?.quality?.profileVerificationRate}
              suffix="%"
            />
            <MetricCard
              title="Match Quality Score"
              value={current.quality.matchQualityScore}
              icon={ChartBarIcon}
              trend={trend?.quality?.matchQualityScore}
              suffix="%"
            />
          </div>
        </div>

        {/* Summary Stats */}
        <Card className="p-6 bg-gradient-to-r from-primary-50 to-accent-50">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Users:</span>
              <span className="ml-2 font-bold text-gray-900">
                {getAllUsers().length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Total Matches:</span>
              <span className="ml-2 font-bold text-gray-900">
                {getMatches().length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Premium Users:</span>
              <span className="ml-2 font-bold text-gray-900">
                {getAllUsers().filter(u => u.subscriptionTier !== 'free').length}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Import required functions

