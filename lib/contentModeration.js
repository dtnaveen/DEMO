/**
 * Content Moderation System
 * AI-powered and manual content moderation
 */

/**
 * Check if text contains inappropriate content
 * @param {string} text - Text to check
 * @returns {Object} Moderation result
 */
export function moderateText(text) {
  if (!text || typeof text !== 'string') {
    return { safe: true, score: 0, flags: [] };
  }

  const lowerText = text.toLowerCase();
  const flags = [];
  let score = 0;

  // Inappropriate words/phrases (simplified - in production, use ML model)
  const inappropriatePatterns = [
    /\b(hate|kill|die|suicide|violence|abuse|harass)\b/i,
    /\b(sex|nude|naked|porn|explicit)\b/i,
    /\b(scam|fraud|fake|spam)\b/i,
    /\b(drugs|cocaine|heroin|illegal)\b/i,
  ];

  // Spam patterns
  const spamPatterns = [
    /(http|https|www\.)/gi, // URLs
    /(buy|sell|discount|offer|click here)/gi,
    /(free money|make money|work from home)/gi,
  ];

  // Check inappropriate content
  inappropriatePatterns.forEach((pattern, index) => {
    if (pattern.test(lowerText)) {
      flags.push(`inappropriate_${index}`);
      score += 30;
    }
  });

  // Check spam
  if (spamPatterns.some(pattern => pattern.test(lowerText))) {
    flags.push('spam');
    score += 20;
  }

  // Check for excessive caps (shouting)
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.5 && text.length > 10) {
    flags.push('excessive_caps');
    score += 10;
  }

  // Check for excessive special characters
  const specialCharRatio = (text.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length / text.length;
  if (specialCharRatio > 0.3) {
    flags.push('excessive_special_chars');
    score += 10;
  }

  return {
    safe: score < 50,
    score: Math.min(score, 100),
    flags,
    requiresReview: score >= 30 && score < 50,
    blocked: score >= 50,
  };
}

/**
 * Moderate profile photos (mock - in production, use image recognition API)
 * @param {File|string} photo - Photo file or URL
 * @returns {Promise<Object>} Moderation result
 */
export async function moderatePhoto(photo) {
  // In production, this would call an image moderation API
  // (e.g., Google Cloud Vision API, AWS Rekognition, or custom ML model)
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock: 95% of photos pass, 5% require review
      const isSafe = Math.random() > 0.05;
      resolve({
        safe: isSafe,
        score: isSafe ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 50) + 50,
        flags: isSafe ? [] : ['requires_review'],
        requiresReview: !isSafe,
        blocked: false, // Never auto-block, always review first
      });
    }, 500);
  });
}

/**
 * Moderate user profile
 * @param {Object} profile - User profile object
 * @returns {Object} Moderation result
 */
export function moderateProfile(profile) {
  const issues = [];
  let score = 0;

  // Check bio
  if (profile.bio) {
    const bioModeration = moderateText(profile.bio);
    if (!bioModeration.safe) {
      issues.push('bio_inappropriate');
      score += bioModeration.score;
    }
  }

  // Check name
  if (profile.name) {
    const nameModeration = moderateText(profile.name);
    if (!nameModeration.safe) {
      issues.push('name_inappropriate');
      score += nameModeration.score;
    }
  }

  // Check for suspicious patterns
  if (profile.email && profile.email.includes('temp') || profile.email.includes('fake')) {
    issues.push('suspicious_email');
    score += 20;
  }

  return {
    safe: score < 50,
    score: Math.min(score, 100),
    issues,
    requiresReview: score >= 30,
    blocked: score >= 50,
  };
}

/**
 * Report content for manual review
 * @param {string} contentType - Type of content (message, profile, photo)
 * @param {string} contentId - ID of the content
 * @param {string} reason - Reason for report
 * @param {string} reporterId - ID of user reporting
 * @returns {Promise<Object>} Report result
 */
export async function reportForReview(contentType, contentId, reason, reporterId) {
  // In production, this would send to moderation queue
  const report = {
    id: `report_${Date.now()}`,
    contentType,
    contentId,
    reason,
    reporterId,
    timestamp: new Date().toISOString(),
    status: 'pending_review',
  };

  // Store in localStorage (in production, send to backend)
  const reports = JSON.parse(localStorage.getItem('moderation_reports') || '[]');
  reports.push(report);
  localStorage.setItem('moderation_reports', JSON.stringify(reports));

  return {
    success: true,
    reportId: report.id,
    message: 'Content reported for review',
  };
}

/**
 * Get moderation statistics
 * @returns {Object} Statistics
 */
export function getModerationStats() {
  const reports = JSON.parse(localStorage.getItem('moderation_reports') || '[]');
  
  return {
    totalReports: reports.length,
    pendingReview: reports.filter(r => r.status === 'pending_review').length,
    reviewed: reports.filter(r => r.status !== 'pending_review').length,
    blocked: reports.filter(r => r.status === 'blocked').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };
}

