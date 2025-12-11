'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import { getUserAnalytics, getInsightsSummary } from '@/lib/userAnalytics';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ChartBarIcon,
  UserCircleIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  SparklesIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const router = useRouter();
  const [, setCurrentUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setCurrentUser(user);
    loadAnalytics();
  }, [router]);

  const loadAnalytics = () => {
    try {
      const data = getUserAnalytics();
      const summary = getInsightsSummary();
      setAnalytics(data);
      setInsights(summary);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics || !insights) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md p-8 text-center">
          <p className="text-gray-600">Unable to load analytics. Please try again later.</p>
          <Button onClick={() => router.push('/discover')} variant="primary" className="mt-4">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  const MetricCard = ({ title, value, icon: Icon, trend, suffix = '', prefix = '', color = 'primary' }) => {
    const colorClasses = {
      primary: 'text-primary-600 bg-primary-50',
      green: 'text-green-600 bg-green-50',
      blue: 'text-blue-600 bg-blue-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50',
    };

    return (
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {Icon && <Icon className="w-6 h-6" />}
          </div>
          {trend && (
            <span className={`text-sm flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
              {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
        <div className="text-3xl font-black text-gray-900">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
      </Card>
    );
  };

  const ProgressBar = ({ label, value, max = 100, color = 'primary' }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const colorClasses = {
      primary: 'bg-primary-600',
      green: 'bg-green-600',
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
    };

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-bold text-gray-900">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${colorClasses[color]} transition-all duration-500 rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'matching', label: 'Matching', icon: HeartIcon },
    { id: 'communication', label: 'Communication', icon: ChatBubbleLeftIcon },
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'insights', label: 'Insights', icon: LightBulbIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Your Analytics</h1>
              <p className="text-gray-600">Understand your performance and improve your experience</p>
            </div>
            <Button onClick={loadAnalytics} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Score</h2>
              <p className="text-gray-600 mb-4">Your comprehensive performance rating</p>
              <div className="flex items-center gap-4">
                <div className="text-6xl font-black text-primary-600">{insights.overallScore}</div>
                <div className="text-sm text-gray-600">
                  <div className="font-semibold">Top Strength:</div>
                  <div className="text-primary-600">{insights.topStrength}</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-2">Quick Stats</div>
              <div className="space-y-1 text-sm">
                <div>Matches: <span className="font-bold">{insights.quickStats.matches}</span></div>
                <div>Match Score: <span className="font-bold">{insights.quickStats.averageMatchScore}%</span></div>
                <div>Profile: <span className="font-bold">{insights.quickStats.profileCompleteness}%</span></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Matches"
                value={analytics.overview.totalMatches}
                icon={HeartIcon}
                color="primary"
              />
              <MetricCard
                title="Profile Views"
                value={analytics.overview.profileViews}
                icon={UserCircleIcon}
                color="blue"
              />
              <MetricCard
                title="Like-to-Match Rate"
                value={analytics.overview.likeToMatchRate}
                icon={ChartBarIcon}
                suffix="%"
                color="green"
              />
              <MetricCard
                title="Average Match Score"
                value={analytics.overview.averageMatchScore}
                icon={StarIcon}
                suffix="%"
                color="purple"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Active Conversations</h3>
                <div className="text-4xl font-black text-primary-600 mb-2">
                  {analytics.overview.activeConversations}
                </div>
                <p className="text-sm text-gray-600">
                  out of {analytics.overview.totalConversations} total conversations
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Total Likes</h3>
                <div className="text-4xl font-black text-green-600 mb-2">
                  {analytics.overview.totalLikes}
                </div>
                <p className="text-sm text-gray-600">Likes you've given</p>
              </Card>
            </div>
          </div>
        )}

        {/* Matching Tab */}
        {activeTab === 'matching' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="High Quality Matches"
                value={analytics.matching.highQualityMatches}
                icon={StarIcon}
                color="green"
              />
              <MetricCard
                title="Average Match Score"
                value={analytics.matching.averageMatchScore}
                icon={ChartBarIcon}
                suffix="%"
                color="primary"
              />
              <MetricCard
                title="Best Match Score"
                value={analytics.matching.bestMatchScore}
                icon={SparklesIcon}
                suffix="%"
                color="purple"
              />
            </div>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Match Quality Distribution</h3>
              <div className="space-y-4">
                <ProgressBar
                  label="High Quality (80%+)"
                  value={analytics.matching.highQualityMatches}
                  max={analytics.overview.totalMatches || 1}
                  color="green"
                />
                <ProgressBar
                  label="Medium Quality (60-79%)"
                  value={analytics.matching.mediumQualityMatches}
                  max={analytics.overview.totalMatches || 1}
                  color="blue"
                />
                <ProgressBar
                  label="Low Quality (<60%)"
                  value={analytics.matching.lowQualityMatches}
                  max={analytics.overview.totalMatches || 1}
                  color="orange"
                />
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Value Alignment</h3>
              <div className="text-3xl font-black text-primary-600 mb-2">
                {analytics.matching.averageValueAlignment}%
              </div>
              <p className="text-sm text-gray-600">Average value alignment with your matches</p>
            </Card>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Avg Response Time"
                value={analytics.communication.averageResponseTime}
                icon={ClockIcon}
                suffix=" hours"
                color="blue"
              />
              <MetricCard
                title="Avg Conversation Length"
                value={analytics.communication.averageConversationLength}
                icon={ChatBubbleLeftIcon}
                suffix=" messages"
                color="primary"
              />
              <MetricCard
                title="Engagement Rate"
                value={analytics.communication.engagementRate}
                icon={ChartBarIcon}
                suffix="%"
                color="green"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Messages Sent</h3>
                <div className="text-4xl font-black text-primary-600">
                  {analytics.communication.totalMessagesSent}
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Messages Received</h3>
                <div className="text-4xl font-black text-green-600">
                  {analytics.communication.totalMessagesReceived}
                </div>
              </Card>
            </div>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Conversation Starter Rate</h3>
              <div className="text-3xl font-black text-purple-600 mb-2">
                {analytics.communication.conversationStarterRate}%
              </div>
              <p className="text-sm text-gray-600">Percentage of conversations you initiated</p>
            </Card>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Completeness</h3>
              <ProgressBar
                label="Overall Profile"
                value={analytics.profile.profileCompleteness}
                color="primary"
              />
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <div className="text-3xl font-black text-gray-900 mb-2">
                  {analytics.profile.photoCount}
                </div>
                <div className="text-sm text-gray-600">Photos</div>
                {analytics.profile.photoCount < 3 && (
                  <div className="text-xs text-orange-600 mt-2">Add more photos</div>
                )}
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-black text-gray-900 mb-2">
                  {analytics.profile.bioLength}
                </div>
                <div className="text-sm text-gray-600">Bio Characters</div>
                {analytics.profile.bioLength < 50 && (
                  <div className="text-xs text-orange-600 mt-2">Expand your bio</div>
                )}
              </Card>
              <Card className="p-6 text-center">
                {analytics.profile.isVerified ? (
                  <>
                    <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Verified</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-black text-gray-400 mb-2">—</div>
                    <div className="text-sm text-gray-600">Not Verified</div>
                    <div className="text-xs text-orange-600 mt-2">Verify now</div>
                  </>
                )}
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-black text-gray-900 mb-2">
                  {analytics.profile.attractivenessScore}
                </div>
                <div className="text-sm text-gray-600">Attractiveness Score</div>
              </Card>
            </div>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Education</div>
                  <div className="font-semibold">{analytics.profile.hasEducation ? '✓' : '✗'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Occupation</div>
                  <div className="font-semibold">{analytics.profile.hasOccupation ? '✓' : '✗'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Lifestyle</div>
                  <div className="font-semibold">{analytics.profile.hasLifestyle ? '✓' : '✗'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Social Media</div>
                  <div className="font-semibold">{analytics.profile.hasSocialMedia ? '✓' : '✗'}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <LightBulbIcon className="w-6 h-6 text-purple-600" />
                Personalized Recommendations
              </h3>
              <div className="space-y-4">
                {analytics.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border-l-4 border-primary-600">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900">{rec.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <p className="text-xs text-primary-600 font-semibold">💡 {rec.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FireIcon className="w-6 h-6 text-orange-600" />
                  Engagement Patterns
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Most Active Day</div>
                    <div className="font-bold text-gray-900">{analytics.engagement.mostActiveDay}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Most Active Time</div>
                    <div className="font-bold text-gray-900 capitalize">{analytics.engagement.mostActiveTime}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Current Streak</div>
                    <div className="font-bold text-primary-600">{analytics.engagement.currentStreak} days</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Best Streak</div>
                    <div className="font-bold text-gray-900">{analytics.engagement.maxStreak} days</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-6 h-6 text-purple-600" />
                  Success Predictions
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Average Success Probability</div>
                    <div className="text-3xl font-black text-green-600">
                      {analytics.success.averageSuccessProbability}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Next Match Success Score</div>
                    <div className="text-2xl font-black text-primary-600">
                      {analytics.success.nextMatchSuccessScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">High Potential Matches</div>
                    <div className="font-bold text-gray-900">{analytics.success.highPotentialMatches}</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

