'use client';

import { useState } from 'react';
import { ShieldExclamationIcon, UserMinusIcon, FlagIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';
import Button from './Button';
import { blockUser, reportUser, getBlockedUsers } from '@/lib/safety';

/**
 * SafetyActions Component
 * Provides block and report functionality
 */
export default function SafetyActions({ 
  userId, 
  userName,
  onBlock,
  onReport 
}) {
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const reportReasons = [
    'Inappropriate content',
    'Harassment or bullying',
    'Spam or fake profile',
    'Underage user',
    'Violence or threats',
    'Other'
  ];

  const handleBlock = () => {
    blockUser(userId);
    if (onBlock) {
      onBlock(userId);
    }
    setShowBlockModal(false);
  };

  const handleReport = () => {
    if (!reportReason) {
      alert('Please select a reason for reporting');
      return;
    }

    reportUser(userId, {
      reason: reportReason,
      details: reportDetails,
      timestamp: new Date().toISOString()
    });

    if (onReport) {
      onReport(userId, reportReason);
    }
    setShowReportModal(false);
    setReportReason('');
    setReportDetails('');
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setShowBlockModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
        >
          <UserMinusIcon className="w-4 h-4" />
          Block
        </button>
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
        >
          <FlagIcon className="w-4 h-4" />
          Report
        </button>
      </div>

      {/* Block Modal */}
      <Modal 
        isOpen={showBlockModal} 
        onClose={() => setShowBlockModal(false)}
        title="Block User"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <ShieldExclamationIcon className="w-6 h-6 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Blocking <strong>{userName}</strong> will prevent them from seeing your profile, messaging you, or matching with you.
            </p>
          </div>
          <p className="text-gray-600 text-sm">
            You can unblock them later from your settings if you change your mind.
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={handleBlock}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              Block User
            </Button>
            <Button 
              onClick={() => setShowBlockModal(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)}
        title="Report User"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Help us keep VibeMatch safe by reporting inappropriate behavior.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for reporting
            </label>
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <label key={reason} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="text-primary-500"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional details (optional)
            </label>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="4"
              placeholder="Please provide any additional information that might help us..."
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleReport}
              disabled={!reportReason}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              Submit Report
            </Button>
            <Button 
              onClick={() => setShowReportModal(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

