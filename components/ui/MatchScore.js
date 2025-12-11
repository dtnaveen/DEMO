'use client';

export default function MatchScore({ score, showBreakdown = false }) {
  const percentage = score?.percentage || 0;
  const breakdown = score?.breakdown || {};
  
  const getScoreColor = (perc) => {
    if (perc >= 80) return 'bg-green-500';
    if (perc >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };
  
  return (
    <div className="space-y-3">
      {/* Overall Score */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Match Score</span>
          <span className="text-2xl font-bold text-primary">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${getScoreColor(percentage)} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      {/* Breakdown */}
      {showBreakdown && (
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Values</span>
              <span>{breakdown.values || 0}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${breakdown.values || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Content</span>
              <span>{breakdown.content || 0}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-purple-500 h-full transition-all duration-500"
                style={{ width: `${breakdown.content || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Lifestyle</span>
              <span>{breakdown.lifestyle || 0}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-pink-500 h-full transition-all duration-500"
                style={{ width: `${breakdown.lifestyle || 0}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
