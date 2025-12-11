/**
 * Enhanced Value-Based Matching
 * Deeper value analysis, long-term compatibility prediction, relationship goal alignment
 */

/**
 * Deep value analysis
 * Analyzes values beyond surface level
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} Deep value analysis
 */
export function deepValueAnalysis(user1, user2) {
  const analysis = {
    coreValues: [],
    valueAlignment: 0,
    potentialConflicts: [],
    complementaryValues: [],
    depth: 'surface', // surface, moderate, deep
  };

  // Analyze value answers for deeper patterns
  if (user1.valueAnswers && user2.valueAnswers) {
    const valuePatterns = analyzeValuePatterns(user1.valueAnswers, user2.valueAnswers);
    analysis.coreValues = valuePatterns.coreValues;
    analysis.valueAlignment = valuePatterns.alignment;
    analysis.potentialConflicts = valuePatterns.conflicts;
    analysis.complementaryValues = valuePatterns.complementary;
    analysis.depth = valuePatterns.depth;
  }

  // Analyze lifestyle for value indicators
  const lifestyleValues = analyzeLifestyleValues(user1, user2);
  analysis.lifestyleAlignment = lifestyleValues.alignment;
  analysis.lifestyleInsights = lifestyleValues.insights;

  // Analyze social media for value indicators
  const socialValues = analyzeSocialValues(user1, user2);
  analysis.socialAlignment = socialValues.alignment;
  analysis.socialInsights = socialValues.insights;

  return analysis;
}

/**
 * Analyze value patterns
 * @param {Array} answers1 - User 1 value answers
 * @param {Array} answers2 - User 2 value answers
 * @returns {Object} Pattern analysis
 */
function analyzeValuePatterns(answers1, answers2) {
  const coreValues = [];
  const conflicts = [];
  const complementary = [];
  let alignment = 0;

  // Identify core values (strong answers)
  for (let i = 0; i < Math.min(answers1.length, answers2.length); i++) {
    const a1 = answers1[i];
    const a2 = answers2[i];
    
    if (a1 === a2) {
      alignment += 10;
      coreValues.push({
        questionIndex: i,
        value: 'aligned',
        strength: 'strong',
      });
    } else if (Math.abs(a1 - a2) === 1) {
      alignment += 5;
      complementary.push({
        questionIndex: i,
        value: 'complementary',
        difference: Math.abs(a1 - a2),
      });
    } else if (Math.abs(a1 - a2) >= 3) {
      conflicts.push({
        questionIndex: i,
        value: 'conflict',
        severity: Math.abs(a1 - a2) >= 4 ? 'high' : 'medium',
      });
    }
  }

  const depth = alignment > 70 ? 'deep' : alignment > 40 ? 'moderate' : 'surface';

  return {
    coreValues,
    alignment: Math.min(alignment, 100),
    conflicts,
    complementary,
    depth,
  };
}

/**
 * Analyze lifestyle for value indicators
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} Lifestyle value analysis
 */
function analyzeLifestyleValues(user1, user2) {
  const insights = [];
  let alignment = 50; // Base alignment

  // Exercise frequency alignment
  if (user1.lifestyle && user2.lifestyle) {
    const exercise1 = user1.lifestyle.includes('Exercise') || user1.lifestyle.includes('Fitness');
    const exercise2 = user2.lifestyle.includes('Exercise') || user2.lifestyle.includes('Fitness');
    
    if (exercise1 === exercise2) {
      alignment += 10;
      insights.push('Both value physical fitness');
    } else {
      insights.push('Different approaches to fitness - could be complementary');
    }
  }

  // Diet preferences
  if (user1.lifestyle && user2.lifestyle) {
    const diet1 = user1.lifestyle.filter(l => l.includes('Diet') || l.includes('Vegan') || l.includes('Vegetarian'));
    const diet2 = user2.lifestyle.filter(l => l.includes('Diet') || l.includes('Vegan') || l.includes('Vegetarian'));
    
    if (diet1.length > 0 && diet2.length > 0 && diet1[0] === diet2[0]) {
      alignment += 15;
      insights.push('Shared dietary values');
    }
  }

  return {
    alignment: Math.min(alignment, 100),
    insights,
  };
}

/**
 * Analyze social media for value indicators
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} Social value analysis
 */
function analyzeSocialValues(user1, user2) {
  const insights = [];
  let alignment = 50;

  // Social media presence indicates values
  if (user1.socialMedia && user2.socialMedia) {
    const hasSocial1 = Object.keys(user1.socialMedia).length > 0;
    const hasSocial2 = Object.keys(user2.socialMedia).length > 0;
    
    if (hasSocial1 === hasSocial2) {
      alignment += 10;
      insights.push('Similar social media engagement');
    }
  }

  return {
    alignment: Math.min(alignment, 100),
    insights,
  };
}

/**
 * Predict long-term compatibility
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @param {Object} interactionData - Interaction history
 * @returns {Object} Long-term compatibility prediction
 */
export function predictLongTermCompatibility(user1, user2, interactionData = {}) {
  const deepAnalysis = deepValueAnalysis(user1, user2);
  
  // Factors for long-term success
  const factors = {
    valueAlignment: deepAnalysis.valueAlignment,
    lifestyleCompatibility: deepAnalysis.lifestyleAlignment || 50,
    communicationQuality: interactionData.communicationScore || 50,
    conflictResolution: interactionData.conflictResolution || 50,
    sharedGoals: analyzeRelationshipGoals(user1, user2),
    growthPotential: analyzeGrowthPotential(user1, user2),
  };

  // Weighted long-term score
  const longTermScore = (
    factors.valueAlignment * 0.30 +
    factors.lifestyleCompatibility * 0.20 +
    factors.communicationQuality * 0.15 +
    factors.conflictResolution * 0.15 +
    factors.sharedGoals * 0.10 +
    factors.growthPotential * 0.10
  );

  const category = longTermScore >= 75 ? 'excellent' :
                   longTermScore >= 60 ? 'good' :
                   longTermScore >= 45 ? 'moderate' : 'challenging';

  return {
    longTermScore: Math.round(longTermScore),
    category,
    factors,
    timeline: generateCompatibilityTimeline(longTermScore),
    recommendations: generateLongTermRecommendations(factors),
  };
}

/**
 * Analyze relationship goals alignment
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {number} Goal alignment score (0-100)
 */
function analyzeRelationshipGoals(user1, user2) {
  const goal1 = user1.preferences?.lookingFor || '';
  const goal2 = user2.preferences?.lookingFor || '';

  if (goal1 === goal2) {
    return 100; // Perfect alignment
  }

  // Compatible goals
  const compatibleGoals = {
    'Relationship': ['Marriage', 'Long-term'],
    'Marriage': ['Relationship', 'Long-term'],
    'Long-term': ['Relationship', 'Marriage'],
    'Casual': ['Friendship', 'Something casual'],
    'Friendship': ['Casual', 'Something casual'],
  };

  if (compatibleGoals[goal1]?.includes(goal2)) {
    return 70; // Compatible
  }

  return 30; // Different goals
}

/**
 * Analyze growth potential
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {number} Growth potential score (0-100)
 */
function analyzeGrowthPotential(user1, user2) {
  let score = 50; // Base score

  // Age compatibility (similar age = more growth potential)
  const ageDiff = Math.abs(user1.age - user2.age);
  if (ageDiff <= 3) score += 20;
  else if (ageDiff <= 5) score += 10;

  // Education compatibility
  if (user1.education && user2.education) {
    if (user1.education === user2.education) score += 15;
    else score += 5;
  }

  // Lifestyle compatibility
  if (user1.lifestyle && user2.lifestyle) {
    const sharedLifestyle = user1.lifestyle.filter(l => user2.lifestyle.includes(l));
    score += Math.min(sharedLifestyle.length * 5, 15);
  }

  return Math.min(score, 100);
}

/**
 * Generate compatibility timeline
 * @param {number} score - Compatibility score
 * @returns {Object} Timeline prediction
 */
function generateCompatibilityTimeline(score) {
  if (score >= 75) {
    return {
      shortTerm: 'Excellent compatibility for first 3 months',
      mediumTerm: 'Strong potential for 6-12 month relationship',
      longTerm: 'High likelihood of long-term success (1+ years)',
    };
  } else if (score >= 60) {
    return {
      shortTerm: 'Good compatibility for initial connection',
      mediumTerm: 'Potential for 3-6 month relationship',
      longTerm: 'Moderate long-term potential',
    };
  } else {
    return {
      shortTerm: 'May require more effort initially',
      mediumTerm: 'Uncertain medium-term compatibility',
      longTerm: 'Challenging for long-term success',
    };
  }
}

/**
 * Generate long-term recommendations
 * @param {Object} factors - Compatibility factors
 * @returns {Array} Recommendations
 */
function generateLongTermRecommendations(factors) {
  const recommendations = [];

  if (factors.valueAlignment < 60) {
    recommendations.push({
      type: 'values',
      message: 'Focus on understanding each other\'s core values early in the relationship',
      priority: 'high',
    });
  }

  if (factors.communicationQuality < 60) {
    recommendations.push({
      type: 'communication',
      message: 'Work on open and honest communication from the start',
      priority: 'high',
    });
  }

  if (factors.sharedGoals < 70) {
    recommendations.push({
      type: 'goals',
      message: 'Discuss relationship goals and expectations early',
      priority: 'medium',
    });
  }

  return recommendations;
}

/**
 * Get relationship goal alignment details
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} Goal alignment details
 */
export function getRelationshipGoalAlignment(user1, user2) {
  const goal1 = user1.preferences?.lookingFor || '';
  const goal2 = user2.preferences?.lookingFor || '';
  
  const alignment = analyzeRelationshipGoals(user1, user2);
  
  return {
    user1Goal: goal1,
    user2Goal: goal2,
    alignment,
    compatible: alignment >= 70,
    recommendation: alignment >= 70 
      ? 'Goals are well-aligned' 
      : 'Consider discussing relationship expectations',
  };
}

