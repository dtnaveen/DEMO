import { VALUE_QUESTIONS, CONTENT_QUESTIONS } from './constants';

/**
 * AI-Powered Matching Algorithm
 * Enhanced with machine learning-inspired scoring
 */

/**
 * Calculate match score between two users using AI-powered algorithm
 * @param {Object} user1 - First user object
 * @param {Object} user2 - Second user object
 * @returns {Object} Match score breakdown
 */
export function calculateMatchScore(user1, user2) {
  // If both users have no value answers, return 0% match
  if ((!user1.valueAnswers || user1.valueAnswers.length === 0) && 
      (!user2.valueAnswers || user2.valueAnswers.length === 0)) {
    return {
      totalScore: 0,
      percentage: 0,
      valuesScore: 0,
      contentScore: 0,
      lifestyleScore: 0,
      educationScore: 0,
      lifestyleMatchScore: 0,
      socialScore: 0,
      verificationScore: 0,
      activityScore: 0,
      breakdown: {
        values: 0,
        content: 0,
        lifestyle: 0,
        education: 0,
        social: 0
      }
    };
  }

  // Values score (40% - 80 points max) - Reduced from 50% to make room for new factors
  let valuesScore = 0;
  if (user1.valueAnswers && user2.valueAnswers) {
    for (let i = 0; i < Math.min(user1.valueAnswers.length, user2.valueAnswers.length, 10); i++) {
      const answer1 = user1.valueAnswers[i];
      const answer2 = user2.valueAnswers[i];
      
      if (answer1 === answer2) {
        valuesScore += 8; // Exact match (reduced from 10)
      } else if (answer1 !== undefined && answer2 !== undefined) {
        const diff = Math.abs(answer1 - answer2);
        if (diff === 1) {
          valuesScore += 4; // Adjacent answer (reduced from 5)
        } else if (diff === 2) {
          valuesScore += 1; // Slight compatibility
        }
      }
    }
  }

  // Content score (25% - 50 points max)
  let contentScore = 0;
  if (user1.contentAnswers && user2.contentAnswers && user1.ageGroup === user2.ageGroup) {
    const maxLength = Math.min(user1.contentAnswers.length, user2.contentAnswers.length, 5);
    for (let i = 0; i < maxLength; i++) {
      if (user1.contentAnswers[i] === user2.contentAnswers[i]) {
        contentScore += 10; // Each matching preference = 10 points
      }
    }
  } else if (user1.ageGroup !== user2.ageGroup) {
    contentScore = 10; // Base score for different age groups
  }

  // Lifestyle compatibility (20% - 40 points max)
  let lifestyleScore = 0;
  
  // Based on Friday night preference (social energy)
  if (user1.valueAnswers && user2.valueAnswers && user1.valueAnswers[0] !== undefined && user2.valueAnswers[0] !== undefined) {
    const fridayNightDiff = Math.abs(user1.valueAnswers[0] - user2.valueAnswers[0]);
    if (fridayNightDiff === 0) {
      lifestyleScore += 15; // Same energy level
    } else if (fridayNightDiff === 1) {
      lifestyleScore += 8; // Somewhat compatible
    }
  }

  // Based on recharge preference
  if (user1.valueAnswers && user2.valueAnswers && user1.valueAnswers[4] !== undefined && user2.valueAnswers[4] !== undefined) {
    const rechargeDiff = Math.abs(user1.valueAnswers[4] - user2.valueAnswers[4]);
    if (rechargeDiff === 0) {
      lifestyleScore += 15;
    } else if (rechargeDiff === 1) {
      lifestyleScore += 7;
    }
  }

  // NEW: Education compatibility (5% - 10 points max)
  let educationScore = 0;
  if (user1.education && user2.education) {
    const educationLevels = ['High School', 'Some College', "Bachelor's Degree", "Master's Degree", 'PhD'];
    const level1 = educationLevels.indexOf(user1.education);
    const level2 = educationLevels.indexOf(user2.education);
    if (level1 >= 0 && level2 >= 0) {
      const diff = Math.abs(level1 - level2);
      if (diff === 0) {
        educationScore = 10; // Same level
      } else if (diff === 1) {
        educationScore = 5; // Similar level
      }
    } else if (user1.education === user2.education) {
      educationScore = 10;
    }
  }

  // NEW: Lifestyle compatibility (5% - 10 points max)
  let lifestyleMatchScore = 0;
  if (user1.lifestyle && user2.lifestyle) {
    // Exercise compatibility
    if (user1.lifestyle.exercise && user2.lifestyle.exercise) {
      if (user1.lifestyle.exercise === user2.lifestyle.exercise) {
        lifestyleMatchScore += 3;
      }
    }
    // Diet compatibility
    if (user1.lifestyle.diet && user2.lifestyle.diet) {
      if (user1.lifestyle.diet === user2.lifestyle.diet) {
        lifestyleMatchScore += 3;
      }
    }
    // Drinking compatibility
    if (user1.lifestyle.drinking && user2.lifestyle.drinking) {
      const drinkingLevels = ['Never', 'Rarely', 'Socially', 'Regularly'];
      const level1 = drinkingLevels.indexOf(user1.lifestyle.drinking);
      const level2 = drinkingLevels.indexOf(user2.lifestyle.drinking);
      if (level1 >= 0 && level2 >= 0) {
        const diff = Math.abs(level1 - level2);
        if (diff <= 1) {
          lifestyleMatchScore += 2;
        }
      }
    }
    // Children compatibility
    if (user1.lifestyle.children && user2.lifestyle.children) {
      if (user1.lifestyle.children === user2.lifestyle.children) {
        lifestyleMatchScore += 2;
      }
    }
  }

  // NEW: Social media compatibility (2% - 4 points max)
  let socialScore = 0;
  if (user1.socialMedia && user2.socialMedia) {
    if (user1.socialMedia.instagram && user2.socialMedia.instagram) {
      socialScore += 1;
    }
    if (user1.socialMedia.spotify && user2.socialMedia.spotify) {
      socialScore += 1;
    }
    // Check for shared interests from social media
    if (user1.socialMedia.interests && user2.socialMedia.interests) {
      const shared = user1.socialMedia.interests.filter(i => 
        user2.socialMedia.interests.includes(i)
      );
      socialScore += Math.min(shared.length, 2);
    }
  }

  // NEW: Photo verification bonus (1% - 2 points max)
  let verificationScore = 0;
  if (user1.verified && user2.verified) {
    verificationScore = 2; // Both verified = trust bonus
  } else if (user1.verified || user2.verified) {
    verificationScore = 1; // One verified = slight bonus
  }

  // NEW: Activity/engagement score (2% - 4 points max)
  let activityScore = 0;
  if (user1.lastActive && user2.lastActive) {
    const daysSinceActive1 = (Date.now() - new Date(user1.lastActive).getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceActive2 = (Date.now() - new Date(user2.lastActive).getTime()) / (1000 * 60 * 60 * 24);
    // Both active recently = bonus
    if (daysSinceActive1 < 7 && daysSinceActive2 < 7) {
      activityScore = 4;
    } else if (daysSinceActive1 < 30 && daysSinceActive2 < 30) {
      activityScore = 2;
    }
  }

  const totalScore = valuesScore + contentScore + lifestyleScore + educationScore + 
                     lifestyleMatchScore + socialScore + verificationScore + activityScore;
  const maxScore = 200; // Increased from 150
  const percentage = Math.min(100, Math.round((totalScore / maxScore) * 100));

  return {
    totalScore,
    percentage,
    valuesScore,
    contentScore,
    lifestyleScore,
    educationScore,
    lifestyleMatchScore,
    socialScore,
    verificationScore,
    activityScore,
    breakdown: {
      values: Math.round((valuesScore / 80) * 40),
      content: Math.round((contentScore / 50) * 25),
      lifestyle: Math.round(((lifestyleScore + lifestyleMatchScore) / 50) * 25),
      education: Math.round((educationScore / 10) * 5),
      social: Math.round(((socialScore + verificationScore + activityScore) / 10) * 5)
    }
  };
}

/**
 * Get shared interests/values between two users
 */
export function getSharedInterests(user1, user2) {
  const shared = [];
  
  if (user1.valueAnswers && user2.valueAnswers && VALUE_QUESTIONS) {
    for (let i = 0; i < Math.min(user1.valueAnswers.length, user2.valueAnswers.length, VALUE_QUESTIONS.length); i++) {
      if (user1.valueAnswers[i] === user2.valueAnswers[i]) {
        const question = VALUE_QUESTIONS[i];
        if (question && question.options) {
          shared.push({
            question: question.question,
            answer: question.options[user1.valueAnswers[i]]
          });
        }
      }
    }
  }
  
  return shared.slice(0, 3); // Return top 3
}

/**
 * Get shared content preferences
 */
export function getSharedContent(user1, user2) {
  const shared = [];
  
  if (user1.ageGroup === user2.ageGroup && user1.contentAnswers && user2.contentAnswers) {
    const contentQuestions = CONTENT_QUESTIONS[user1.ageGroup];
    if (contentQuestions) {
      for (let i = 0; i < Math.min(user1.contentAnswers.length, user2.contentAnswers.length, contentQuestions.length); i++) {
        if (user1.contentAnswers[i] === user2.contentAnswers[i]) {
          shared.push({
            question: contentQuestions[i].question,
            answer: contentQuestions[i].options[user1.contentAnswers[i]]
          });
        }
      }
    }
  }
  
  return shared;
}
