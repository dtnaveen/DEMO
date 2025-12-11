/**
 * AI Profile Optimization
 * Helps users optimize their profiles for better matches
 */

/**
 * Analyze profile completeness
 * @param {Object} profile - User profile
 * @returns {Object} Completeness analysis
 */
export function analyzeProfileCompleteness(profile) {
  const fields = {
    photos: profile.photos && profile.photos.length > 0,
    bio: profile.bio && profile.bio.length > 20,
    education: !!profile.education,
    occupation: !!profile.occupation,
    lifestyle: profile.lifestyle && profile.lifestyle.length > 0,
    socialMedia: profile.socialMedia && Object.keys(profile.socialMedia).length > 0,
    verified: profile.isVerified,
    valueAnswers: profile.valueAnswers && profile.valueAnswers.length === 10,
    contentAnswers: profile.contentAnswers && profile.contentAnswers.length > 0,
  };

  const totalFields = Object.keys(fields).length;
  const completedFields = Object.values(fields).filter(Boolean).length;
  const percentage = Math.round((completedFields / totalFields) * 100);

  return {
    percentage,
    completedFields,
    totalFields,
    fields,
    recommendations: generateRecommendations(fields, profile),
  };
}

/**
 * Generate profile optimization recommendations
 * @param {Object} fields - Field completion status
 * @param {Object} profile - User profile
 * @returns {Array} Recommendations
 */
function generateRecommendations(fields, profile) {
  const recommendations = [];

  if (!fields.photos) {
    recommendations.push({
      priority: 'high',
      field: 'photos',
      message: 'Add at least one photo to increase your match rate by 300%',
      action: 'Add Photos',
    });
  } else if (profile.photos && profile.photos.length < 3) {
    recommendations.push({
      priority: 'medium',
      field: 'photos',
      message: 'Add more photos (3-6 recommended) to show your personality',
      action: 'Add More Photos',
    });
  }

  if (!fields.bio) {
    recommendations.push({
      priority: 'high',
      field: 'bio',
      message: 'Write a bio to help others understand your personality',
      action: 'Write Bio',
    });
  } else if (profile.bio && profile.bio.length < 50) {
    recommendations.push({
      priority: 'medium',
      field: 'bio',
      message: 'Expand your bio (50+ characters) to attract better matches',
      action: 'Expand Bio',
    });
  }

  if (!fields.verified) {
    recommendations.push({
      priority: 'high',
      field: 'verification',
      message: 'Verify your profile to build trust and get 2x more matches',
      action: 'Verify Profile',
    });
  }

  if (!fields.education) {
    recommendations.push({
      priority: 'low',
      field: 'education',
      message: 'Add your education level to help others find you',
      action: 'Add Education',
    });
  }

  if (!fields.occupation) {
    recommendations.push({
      priority: 'low',
      field: 'occupation',
      message: 'Share your occupation to show your lifestyle',
      action: 'Add Occupation',
    });
  }

  if (!fields.socialMedia || Object.keys(profile.socialMedia || {}).length === 0) {
    recommendations.push({
      priority: 'low',
      field: 'socialMedia',
      message: 'Link your Instagram or Spotify to show more of your personality',
      action: 'Link Social Media',
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Analyze profile photos for best selection
 * @param {Array} photos - Array of photo URLs
 * @returns {Object} Photo analysis
 */
export function analyzeProfilePhotos(photos) {
  if (!photos || photos.length === 0) {
    return {
      bestPhoto: null,
      score: 0,
      recommendations: ['Add at least one photo'],
    };
  }

  // In production, use ML model to analyze:
  // - Face visibility
  // - Photo quality
  // - Lighting
  // - Smiling
  // - Eye contact
  // - Background quality

  // Mock analysis
  const analysis = photos.map((photo, index) => ({
    index,
    url: photo,
    score: Math.floor(Math.random() * 40) + 60, // 60-100
    factors: {
      hasFace: Math.random() > 0.2,
      goodLighting: Math.random() > 0.3,
      clearBackground: Math.random() > 0.4,
      smiling: Math.random() > 0.5,
    },
  }));

  const bestPhoto = analysis.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return {
    bestPhoto: bestPhoto.index,
    score: bestPhoto.score,
    analysis,
    recommendations: generatePhotoRecommendations(analysis),
  };
}

/**
 * Generate photo recommendations
 * @param {Array} analysis - Photo analysis array
 * @returns {Array} Recommendations
 */
function generatePhotoRecommendations(analysis) {
  const recommendations = [];

  const lowQualityPhotos = analysis.filter(p => p.score < 70);
  if (lowQualityPhotos.length > 0) {
    recommendations.push({
      type: 'quality',
      message: `${lowQualityPhotos.length} photo(s) could be improved. Use better lighting and clear backgrounds.`,
    });
  }

  const noFacePhotos = analysis.filter(p => !p.factors.hasFace);
  if (noFacePhotos.length > 0) {
    recommendations.push({
      type: 'face',
      message: 'Make sure your face is clearly visible in at least one photo.',
    });
  }

  if (analysis.length < 3) {
    recommendations.push({
      type: 'quantity',
      message: 'Add more photos (3-6 recommended) to show different aspects of your personality.',
    });
  }

  return recommendations;
}

/**
 * Predict match success probability
 * @param {Object} profile - User profile
 * @returns {Object} Success prediction
 */
export function predictMatchSuccess(profile) {
  const completeness = analyzeProfileCompleteness(profile);
  
  // Factors that influence success:
  // - Profile completeness (30%)
  // - Photo quality (25%)
  // - Bio quality (20%)
  // - Verification status (15%)
  // - Social media links (10%)

  let score = 0;

  // Profile completeness
  score += (completeness.percentage / 100) * 30;

  // Photo quality (mock)
  const photoAnalysis = analyzeProfilePhotos(profile.photos);
  score += (photoAnalysis.score / 100) * 25;

  // Bio quality
  if (profile.bio) {
    const bioLength = profile.bio.length;
    const bioScore = Math.min(bioLength / 200, 1) * 20; // 200 chars = full score
    score += bioScore;
  }

  // Verification
  if (profile.isVerified) {
    score += 15;
  }

  // Social media
  if (profile.socialMedia && Object.keys(profile.socialMedia).length > 0) {
    score += 10;
  }

  const successRate = Math.round(score);
  const category = successRate >= 80 ? 'excellent' : 
                   successRate >= 60 ? 'good' : 
                   successRate >= 40 ? 'fair' : 'needs_improvement';

  return {
    successRate,
    category,
    factors: {
      completeness: completeness.percentage,
      photoQuality: photoAnalysis.score,
      bioQuality: profile.bio ? Math.min(profile.bio.length / 200, 1) * 100 : 0,
      verified: profile.isVerified,
      socialMedia: profile.socialMedia && Object.keys(profile.socialMedia).length > 0,
    },
    recommendations: completeness.recommendations,
  };
}

/**
 * Get AI-generated bio suggestions
 * @param {Object} profile - User profile
 * @returns {Array} Bio suggestions
 */
export function generateBioSuggestions(profile) {
  // In production, use GPT/LLM to generate personalized bio suggestions
  // Based on: interests, lifestyle, occupation, values

  const suggestions = [
    `Love ${profile.lifestyle?.[0] || 'adventures'} and looking for someone to share ${profile.preferences?.lookingFor || 'great moments'} with.`,
    `${profile.occupation || 'Professional'} who enjoys ${profile.lifestyle?.join(', ') || 'life'}. Let's connect!`,
    `Passionate about ${profile.lifestyle?.[0] || 'living life'} and finding meaningful connections.`,
  ];

  return suggestions;
}

