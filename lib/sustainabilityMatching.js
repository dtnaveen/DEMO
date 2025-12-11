/**
 * Sustainability & Values Matching
 * Eco-conscious matching, social impact alignment, values-based communities
 */

/**
 * Sustainability values
 */
export const SUSTAINABILITY_VALUES = {
  ECO_CONSCIOUS: 'eco_conscious',
  CARBON_NEUTRAL: 'carbon_neutral',
  ZERO_WASTE: 'zero_waste',
  PLANT_BASED: 'plant_based',
  SUSTAINABLE_TRAVEL: 'sustainable_travel',
  ETHICAL_CONSUMPTION: 'ethical_consumption',
  CLIMATE_ACTION: 'climate_action',
  RENEWABLE_ENERGY: 'renewable_energy',
};

/**
 * Social impact values
 */
export const SOCIAL_IMPACT_VALUES = {
  SOCIAL_JUSTICE: 'social_justice',
  EQUALITY: 'equality',
  COMMUNITY_SERVICE: 'community_service',
  CHARITY: 'charity',
  VOLUNTEERING: 'volunteering',
  ACTIVISM: 'activism',
  EDUCATION: 'education',
  HEALTHCARE: 'healthcare',
};

/**
 * Analyze sustainability alignment
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} Sustainability alignment
 */
export function analyzeSustainabilityAlignment(user1, user2) {
  const values1 = user1.sustainabilityValues || [];
  const values2 = user2.sustainabilityValues || [];

  const sharedValues = values1.filter(v => values2.includes(v));
  const alignment = (sharedValues.length / Math.max(values1.length, values2.length, 1)) * 100;

  return {
    alignment: Math.round(alignment),
    sharedValues,
    user1Values: values1,
    user2Values: values2,
    category: alignment >= 70 ? 'high' :
               alignment >= 40 ? 'medium' : 'low',
    insights: generateSustainabilityInsights(sharedValues, values1, values2),
  };
}

/**
 * Generate sustainability insights
 * @param {Array} sharedValues - Shared values
 * @param {Array} values1 - User 1 values
 * @param {Array} values2 - User 2 values
 * @returns {Array} Insights
 */
function generateSustainabilityInsights(sharedValues, values1, values2) {
  const insights = [];

  if (sharedValues.includes(SUSTAINABILITY_VALUES.ECO_CONSCIOUS)) {
    insights.push('Both prioritize environmental consciousness');
  }

  if (sharedValues.includes(SUSTAINABILITY_VALUES.PLANT_BASED)) {
    insights.push('Shared commitment to plant-based lifestyle');
  }

  if (sharedValues.includes(SUSTAINABILITY_VALUES.SUSTAINABLE_TRAVEL)) {
    insights.push('Both value sustainable travel practices');
  }

  if (values1.length === 0 && values2.length > 0) {
    insights.push('Consider discussing sustainability values');
  }

  return insights;
}

/**
 * Analyze social impact alignment
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} Social impact alignment
 */
export function analyzeSocialImpactAlignment(user1, user2) {
  const values1 = user1.socialImpactValues || [];
  const values2 = user2.socialImpactValues || [];

  const sharedValues = values1.filter(v => values2.includes(v));
  const alignment = (sharedValues.length / Math.max(values1.length, values2.length, 1)) * 100;

  return {
    alignment: Math.round(alignment),
    sharedValues,
    user1Values: values1,
    user2Values: values2,
    category: alignment >= 70 ? 'high' :
               alignment >= 40 ? 'medium' : 'low',
    insights: generateSocialImpactInsights(sharedValues),
  };
}

/**
 * Generate social impact insights
 * @param {Array} sharedValues - Shared values
 * @returns {Array} Insights
 */
function generateSocialImpactInsights(sharedValues) {
  const insights = [];

  if (sharedValues.includes(SOCIAL_IMPACT_VALUES.SOCIAL_JUSTICE)) {
    insights.push('Both committed to social justice');
  }

  if (sharedValues.includes(SOCIAL_IMPACT_VALUES.VOLUNTEERING)) {
    insights.push('Shared passion for volunteering');
  }

  if (sharedValues.includes(SOCIAL_IMPACT_VALUES.ACTIVISM)) {
    insights.push('Both engaged in activism');
  }

  return insights;
}

/**
 * Get eco-conscious matches
 * @param {Object} user - Current user
 * @param {Array} allUsers - All users
 * @returns {Array} Eco-conscious matches
 */
export function getEcoConsciousMatches(user, allUsers) {
  const userValues = user.sustainabilityValues || [];

  return allUsers
    .filter(u => u.id !== user.id)
    .map(u => ({
      user: u,
      sustainability: analyzeSustainabilityAlignment(user, u),
      socialImpact: analyzeSocialImpactAlignment(user, u),
    }))
    .filter(m => 
      m.sustainability.alignment >= 40 || 
      m.socialImpact.alignment >= 40 ||
      (m.user.sustainabilityValues && m.user.sustainabilityValues.length > 0)
    )
    .sort((a, b) => {
      const scoreA = (a.sustainability.alignment + a.socialImpact.alignment) / 2;
      const scoreB = (b.sustainability.alignment + b.socialImpact.alignment) / 2;
      return scoreB - scoreA;
    });
}

/**
 * Create values-based community
 * @param {string} name - Community name
 * @param {Array} values - Community values
 * @param {string} type - 'sustainability' or 'social_impact'
 * @param {Object} creator - Creator user
 * @returns {Object} Community
 */
export function createValuesCommunity(name, values, type, creator) {
  const community = {
    id: `community_${Date.now()}`,
    name,
    type,
    values,
    creatorId: creator.id,
    members: [creator.id],
    createdAt: new Date().toISOString(),
    description: `Community for ${type === 'sustainability' ? 'eco-conscious' : 'social impact'} individuals`,
  };

  // Save community
  const communities = JSON.parse(localStorage.getItem('values_communities') || '[]');
  communities.push(community);
  localStorage.setItem('values_communities', JSON.stringify(communities));

  return community;
}

/**
 * Get values-based communities
 * @param {string} type - 'sustainability' or 'social_impact' or 'all'
 * @returns {Array} Communities
 */
export function getValuesCommunities(type = 'all') {
  const communities = JSON.parse(localStorage.getItem('values_communities') || '[]');
  
  if (type === 'all') {
    return communities;
  }

  return communities.filter(c => c.type === type);
}

/**
 * Join values community
 * @param {string} communityId - Community ID
 * @param {Object} user - User joining
 * @returns {Object} Updated community
 */
export function joinValuesCommunity(communityId, user) {
  const communities = JSON.parse(localStorage.getItem('values_communities') || '[]');
  const community = communities.find(c => c.id === communityId);

  if (!community) {
    throw new Error('Community not found');
  }

  if (!community.members.includes(user.id)) {
    community.members.push(user.id);
    localStorage.setItem('values_communities', JSON.stringify(communities));
  }

  return community;
}

/**
 * Get user's sustainability score
 * @param {Object} user - User object
 * @returns {Object} Sustainability score
 */
export function getUserSustainabilityScore(user) {
  const sustainabilityValues = user.sustainabilityValues || [];
  const socialImpactValues = user.socialImpactValues || [];

  const score = {
    sustainability: sustainabilityValues.length * 12.5, // Max 100
    socialImpact: socialImpactValues.length * 12.5, // Max 100
    overall: 0,
    level: 'beginner',
    badges: [],
  };

  score.overall = Math.round((score.sustainability + score.socialImpact) / 2);

  if (score.overall >= 80) {
    score.level = 'champion';
    score.badges.push('Sustainability Champion');
  } else if (score.overall >= 60) {
    score.level = 'advocate';
    score.badges.push('Eco Advocate');
  } else if (score.overall >= 40) {
    score.level = 'conscious';
    score.badges.push('Eco Conscious');
  } else if (score.overall >= 20) {
    score.level = 'aware';
  }

  if (sustainabilityValues.length >= 5) {
    score.badges.push('Green Warrior');
  }

  if (socialImpactValues.length >= 5) {
    score.badges.push('Social Impact Leader');
  }

  return score;
}

