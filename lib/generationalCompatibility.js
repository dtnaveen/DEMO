/**
 * Generational Compatibility & Age-Group Features
 * Generational compatibility, age-appropriate content, life stage matching
 */

import { getAgeGroup } from './constants';

/**
 * Analyze generational compatibility
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} Generational compatibility analysis
 */
export function analyzeGenerationalCompatibility(user1, user2) {
  const ageGroup1 = user1.ageGroup || getAgeGroup(user1.age);
  const ageGroup2 = user2.ageGroup || getAgeGroup(user2.age);

  const compatibility = {
    sameGeneration: ageGroup1 === ageGroup2,
    ageGroup1,
    ageGroup2,
    generationalGap: calculateGenerationalGap(ageGroup1, ageGroup2),
    culturalReferences: analyzeCulturalReferences(ageGroup1, ageGroup2),
    lifeStageAlignment: analyzeLifeStage(user1, user2),
    communicationStyle: analyzeCommunicationStyle(ageGroup1, ageGroup2),
  };

  compatibility.score = calculateGenerationalScore(compatibility);

  return compatibility;
}

/**
 * Calculate generational gap
 * @param {string} group1 - Age group 1
 * @param {string} group2 - Age group 2
 * @returns {Object} Gap analysis
 */
function calculateGenerationalGap(group1, group2) {
  const groups = ['Gen Alpha', 'Gen Z', 'Millennials', 'Gen X', 'Boomers'];
  const index1 = groups.indexOf(group1);
  const index2 = groups.indexOf(group2);

  if (index1 === -1 || index2 === -1) {
    return { gap: 'unknown', severity: 'unknown' };
  }

  const gap = Math.abs(index1 - index2);
  
  return {
    gap,
    severity: gap === 0 ? 'none' : gap === 1 ? 'small' : gap === 2 ? 'moderate' : 'large',
    description: gap === 0 ? 'Same generation' :
                 gap === 1 ? 'Adjacent generations' :
                 gap === 2 ? 'Two generations apart' :
                 'Multiple generations apart',
  };
}

/**
 * Analyze cultural references compatibility
 * @param {string} group1 - Age group 1
 * @param {string} group2 - Age group 2
 * @returns {Object} Cultural reference analysis
 */
function analyzeCulturalReferences(group1, group2) {
  const culturalMap = {
    'Gen Alpha': {
      music: '2020s pop, TikTok trends',
      media: 'Streaming platforms, YouTube Shorts',
      values: 'Digital native, social justice',
    },
    'Gen Z': {
      music: '2010s-2020s pop, indie, hip-hop',
      media: 'Netflix, TikTok, Instagram',
      values: 'Authenticity, mental health awareness',
    },
    'Millennials': {
      music: '2000s-2010s pop, rock, alternative',
      media: 'Netflix, Hulu, traditional TV',
      values: 'Work-life balance, experiences over things',
    },
    'Gen X': {
      music: '80s-90s rock, pop, grunge',
      media: 'Traditional TV, streaming',
      values: 'Independence, pragmatism',
    },
    'Boomers': {
      music: '60s-80s classic rock, pop',
      media: 'Traditional TV, newspapers',
      values: 'Hard work, traditional values',
    },
  };

  const culture1 = culturalMap[group1] || {};
  const culture2 = culturalMap[group2] || {};

  const shared = {
    music: group1 === group2 ? 'High overlap' : 'Different eras',
    media: group1 === group2 ? 'Similar platforms' : 'Different preferences',
    values: group1 === group2 ? 'Aligned values' : 'May differ',
  };

  return {
    group1: culture1,
    group2: culture2,
    shared,
    compatibility: group1 === group2 ? 'high' : 'moderate',
  };
}

/**
 * Analyze life stage alignment
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} Life stage analysis
 */
export function analyzeLifeStage(user1, user2) {
  const stage1 = getLifeStage(user1);
  const stage2 = getLifeStage(user2);

  const alignment = {
    user1Stage: stage1,
    user2Stage: stage2,
    sameStage: stage1.stage === stage2.stage,
    compatibleStages: areStagesCompatible(stage1, stage2),
    considerations: getLifeStageConsiderations(stage1, stage2),
  };

  return alignment;
}

/**
 * Get user's life stage
 * @param {Object} user - User object
 * @returns {Object} Life stage
 */
function getLifeStage(user) {
  const age = user.age || 25;
  const education = user.education || '';
  const occupation = user.occupation || '';
  const lifestyle = user.lifestyle || [];

  if (age < 22) {
    return {
      stage: 'student',
      description: 'Student/College',
      priorities: ['Education', 'Social life', 'Exploration'],
      responsibilities: 'Low',
    };
  } else if (age < 28) {
    return {
      stage: 'early-career',
      description: 'Early Career',
      priorities: ['Career building', 'Independence', 'Social connections'],
      responsibilities: 'Moderate',
    };
  } else if (age < 35) {
    return {
      stage: 'established',
      description: 'Established Professional',
      priorities: ['Career growth', 'Stability', 'Relationships'],
      responsibilities: 'High',
    };
  } else if (age < 45) {
    return {
      stage: 'mid-career',
      description: 'Mid-Career',
      priorities: ['Career advancement', 'Family planning', 'Financial security'],
      responsibilities: 'Very High',
    };
  } else {
    return {
      stage: 'mature',
      description: 'Mature Professional',
      priorities: ['Stability', 'Family', 'Life balance'],
      responsibilities: 'Very High',
    };
  }
}

/**
 * Check if life stages are compatible
 * @param {Object} stage1 - Life stage 1
 * @param {Object} stage2 - Life stage 2
 * @returns {boolean} Compatibility
 */
function areStagesCompatible(stage1, stage2) {
  if (stage1.stage === stage2.stage) return true;

  const compatiblePairs = [
    ['student', 'early-career'],
    ['early-career', 'established'],
    ['established', 'mid-career'],
    ['mid-career', 'mature'],
  ];

  return compatiblePairs.some(pair => 
    (pair[0] === stage1.stage && pair[1] === stage2.stage) ||
    (pair[1] === stage1.stage && pair[0] === stage2.stage)
  );
}

/**
 * Get life stage considerations
 * @param {Object} stage1 - Life stage 1
 * @param {Object} stage2 - Life stage 2
 * @returns {Array} Considerations
 */
function getLifeStageConsiderations(stage1, stage2) {
  const considerations = [];

  if (stage1.stage !== stage2.stage) {
    considerations.push({
      type: 'timing',
      message: `Different life stages: ${stage1.description} vs ${stage2.description}`,
      impact: 'moderate',
    });

    if (stage1.responsibilities !== stage2.responsibilities) {
      considerations.push({
        type: 'responsibilities',
        message: 'Different levels of responsibilities may affect availability',
        impact: 'low',
      });
    }
  }

  return considerations;
}

/**
 * Analyze communication style by generation
 * @param {string} group1 - Age group 1
 * @param {string} group2 - Age group 2
 * @returns {Object} Communication style analysis
 */
function analyzeCommunicationStyle(group1, group2) {
  const styles = {
    'Gen Alpha': {
      preferred: 'Text, video messages, emojis',
      formality: 'Very casual',
      responseTime: 'Immediate',
    },
    'Gen Z': {
      preferred: 'Text, DMs, memes',
      formality: 'Casual',
      responseTime: 'Quick (hours)',
    },
    'Millennials': {
      preferred: 'Text, email, calls',
      formality: 'Casual to professional',
      responseTime: 'Moderate (same day)',
    },
    'Gen X': {
      preferred: 'Calls, email, text',
      formality: 'Professional to casual',
      responseTime: 'Moderate to slow',
    },
    'Boomers': {
      preferred: 'Calls, email',
      formality: 'Professional',
      responseTime: 'Slower (days)',
    },
  };

  const style1 = styles[group1] || {};
  const style2 = styles[group2] || {};

  return {
    group1: style1,
    group2: style2,
    compatibility: group1 === group2 ? 'high' : 'moderate',
    recommendations: group1 === group2 
      ? ['Communication styles align well']
      : ['Be mindful of different communication preferences', 'Discuss preferred communication methods'],
  };
}

/**
 * Calculate generational compatibility score
 * @param {Object} compatibility - Compatibility object
 * @returns {number} Score (0-100)
 */
function calculateGenerationalScore(compatibility) {
  let score = 50; // Base score

  if (compatibility.sameGeneration) {
    score += 30;
  } else if (compatibility.generationalGap.severity === 'small') {
    score += 15;
  } else if (compatibility.generationalGap.severity === 'moderate') {
    score += 5;
  }

  if (compatibility.culturalReferences.compatibility === 'high') {
    score += 15;
  }

  if (compatibility.lifeStageAlignment.sameStage) {
    score += 20;
  } else if (compatibility.lifeStageAlignment.compatibleStages) {
    score += 10;
  }

  return Math.min(score, 100);
}

/**
 * Get age-appropriate content recommendations
 * @param {string} ageGroup - Age group
 * @returns {Object} Content recommendations
 */
export function getAgeAppropriateContent(ageGroup) {
  const contentMap = {
    'Gen Alpha': {
      questions: 'Trending topics, social media, gaming',
      prompts: 'TikTok trends, latest memes, gaming references',
      tone: 'Very casual, emoji-friendly',
    },
    'Gen Z': {
      questions: 'Social issues, pop culture, authenticity',
      prompts: 'Current events, memes, social justice',
      tone: 'Casual, authentic, direct',
    },
    'Millennials': {
      questions: 'Career, experiences, work-life balance',
      prompts: 'Travel, hobbies, career goals',
      tone: 'Casual to professional',
    },
    'Gen X': {
      questions: 'Family, career, stability',
      prompts: 'Life experiences, family values, career',
      tone: 'Professional to casual',
    },
    'Boomers': {
      questions: 'Traditional values, family, stability',
      prompts: 'Life experiences, family, values',
      tone: 'Professional, respectful',
    },
  };

  return contentMap[ageGroup] || contentMap['Millennials'];
}

