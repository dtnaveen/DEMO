import { getAllUsers, setAllUsers } from './localStorage';
import { VALUE_QUESTIONS, CONTENT_QUESTIONS, GENDERS, LOOKING_FOR, GENDER_PREFERENCES, getAgeGroup } from './constants';
import { generateId, devLog } from '../utils/helpers';
import { DEFAULT_BOT_PROFILE } from './botProfile';
import { getTestCredentials } from './testCredentials';

/**
 * Create profiles that match well with existing users
 */
export function createMatchingProfiles(count = 3) {
  if (typeof window === 'undefined') return;
  
  try {
    const allUsers = getAllUsers();
    
    if (allUsers.length === 0) {
      // No existing users found
      return;
    }
    
    // Analyze existing users to find common patterns
    const analysis = analyzeUsers(allUsers);
    
    // Create matching profiles
    const newProfiles = [];
    
    for (let i = 0; i < count; i++) {
      const profile = createCompatibleProfile(analysis, allUsers, i);
      newProfiles.push(profile);
    }
    
    // Validate all profiles have complete answers
    newProfiles.forEach(profile => {
      if (profile.valueAnswers.length !== 10) {
        console.error(`Profile ${profile.name} missing value answers: ${profile.valueAnswers.length}/10`);
      }
      if (profile.contentAnswers.length !== 5) {
        console.error(`Profile ${profile.name} missing content answers: ${profile.contentAnswers.length}/5`);
      }
    });
    
    // Add new profiles to existing users
    const updatedUsers = [...allUsers, ...newProfiles];
    setAllUsers(updatedUsers);
    
    // Profiles created successfully
    return newProfiles;
  } catch (error) {
    console.error('Error creating matching profiles:', error);
    return [];
  }
}

/**
 * Analyze existing users to find common patterns
 */
function analyzeUsers(users) {
  if (users.length === 0) return null;
  
  // Count most common answers
  const valueAnswerCounts = Array(10).fill(null).map(() => ({}));
  const ageGroups = {};
  const genders = {};
  const ageRanges = [];
  const locations = {};
  const contentAnswerCounts = {
    'Gen Z': Array(5).fill(null).map(() => ({})),
    'Millennials': Array(5).fill(null).map(() => ({})),
    'Gen Alpha': Array(5).fill(null).map(() => ({}))
  };
  
  users.forEach(user => {
    // Count value answers
    if (user.valueAnswers) {
      user.valueAnswers.forEach((answer, idx) => {
        if (answer !== undefined) {
          valueAnswerCounts[idx][answer] = (valueAnswerCounts[idx][answer] || 0) + 1;
        }
      });
    }
    
    // Count age groups
    if (user.ageGroup) {
      ageGroups[user.ageGroup] = (ageGroups[user.ageGroup] || 0) + 1;
    }
    
    // Count genders
    if (user.gender) {
      genders[user.gender] = (genders[user.gender] || 0) + 1;
    }
    
    // Collect ages
    if (user.age) {
      ageRanges.push(user.age);
    }
    
    // Count locations
    if (user.location) {
      locations[user.location] = (locations[user.location] || 0) + 1;
    }
    
    // Count content answers
    if (user.ageGroup && user.contentAnswers && CONTENT_QUESTIONS[user.ageGroup]) {
      if (!contentAnswerCounts[user.ageGroup]) {
        contentAnswerCounts[user.ageGroup] = Array(5).fill(null).map(() => ({}));
      }
      user.contentAnswers.forEach((answer, idx) => {
        if (answer !== undefined && contentAnswerCounts[user.ageGroup] && contentAnswerCounts[user.ageGroup][idx]) {
          contentAnswerCounts[user.ageGroup][idx][answer] = 
            (contentAnswerCounts[user.ageGroup][idx][answer] || 0) + 1;
        }
      });
    }
  });
  
  // Find most common answers
  const mostCommonValueAnswers = valueAnswerCounts.map(counts => {
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 0);
  });
  
  // Find most common age group
  const mostCommonAgeGroup = Object.keys(ageGroups).reduce((a, b) => 
    ageGroups[a] > ageGroups[b] ? a : b, 'Gen Z'
  );
  
  // Calculate average age
  const avgAge = ageRanges.length > 0 
    ? Math.round(ageRanges.reduce((a, b) => a + b, 0) / ageRanges.length)
    : 25;
  
  // Find most common location
  const mostCommonLocation = Object.keys(locations).reduce((a, b) => 
    locations[a] > locations[b] ? a : b, 'New York'
  );
  
  // Find most common content answers for each age group
  const mostCommonContentAnswers = {};
  Object.keys(contentAnswerCounts).forEach(ageGroup => {
    mostCommonContentAnswers[ageGroup] = contentAnswerCounts[ageGroup].map(counts => {
      if (Object.keys(counts).length === 0) return 0;
      return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 0);
    });
  });
  
  return {
    mostCommonValueAnswers,
    mostCommonAgeGroup,
    avgAge,
    mostCommonLocation,
    mostCommonContentAnswers,
    ageGroups,
    genders,
    users
  };
}

/**
 * Create a profile that's compatible with existing users
 */
function createCompatibleProfile(analysis, existingUsers, index) {
  if (!analysis) {
    // Fallback if analysis fails
    return createFallbackProfile(index);
  }
  
  // Choose age group based on most common, with some variation
  const ageGroupOptions = Object.keys(analysis.ageGroups).sort((a, b) => 
    analysis.ageGroups[b] - analysis.ageGroups[a]
  );
  const ageGroup = index < ageGroupOptions.length 
    ? ageGroupOptions[index] 
    : analysis.mostCommonAgeGroup;
  
  // Create age in appropriate range for age group
  let age;
  if (ageGroup === 'Gen Z') {
    age = 20 + index * 2; // 20, 22, 24
    if (age > 27) age = 27;
  } else if (ageGroup === 'Millennials') {
    age = 30 + index * 3; // 30, 33, 36
    if (age > 43) age = 43;
  } else {
    age = 20 + index * 2;
  }
  
  // Use most common value answers, with slight variations - ENSURE ALL 10 QUESTIONS ANSWERED
  const valueAnswers = analysis.mostCommonValueAnswers.map((commonAnswer, idx) => {
    // Ensure we always have an answer
    if (commonAnswer === undefined || isNaN(parseInt(commonAnswer))) {
      return Math.floor(Math.random() * VALUE_QUESTIONS[idx].options.length);
    }
    // Use common answer 70% of the time, vary 30%
    if (Math.random() < 0.7) {
      return parseInt(commonAnswer);
    } else {
      // Slight variation (adjacent answer)
      const variation = Math.random() < 0.5 ? -1 : 1;
      const newAnswer = parseInt(commonAnswer) + variation;
      const maxAnswer = VALUE_QUESTIONS[idx].options.length - 1;
      return Math.max(0, Math.min(maxAnswer, newAnswer));
    }
  });
  
  // Ensure we have exactly 10 answers
  if (valueAnswers.length < 10) {
    for (let i = valueAnswers.length; i < 10; i++) {
      valueAnswers[i] = Math.floor(Math.random() * VALUE_QUESTIONS[i].options.length);
    }
  }
  
  // Use most common content answers for the age group - ENSURE ALL 5 QUESTIONS ANSWERED
  let contentAnswers = [];
  if (analysis.mostCommonContentAnswers[ageGroup] && analysis.mostCommonContentAnswers[ageGroup].length === 5) {
    contentAnswers = analysis.mostCommonContentAnswers[ageGroup].map((answer, idx) => {
      if (answer === undefined || isNaN(parseInt(answer))) {
        const contentQ = CONTENT_QUESTIONS[ageGroup];
        if (contentQ && contentQ[idx]) {
          return Math.floor(Math.random() * contentQ[idx].options.length);
        }
        return 0;
      }
      return parseInt(answer);
    });
  } else {
    // Generate answers if not available
    const contentQ = CONTENT_QUESTIONS[ageGroup];
    if (contentQ) {
      contentAnswers = contentQ.map((question, idx) => {
        return Math.floor(Math.random() * question.options.length);
      });
    } else {
      // Fallback if age group not found
      contentAnswers = Array(5).fill(0).map(() => Math.floor(Math.random() * 3));
    }
  }
  
  // Ensure we have exactly 5 content answers
  if (contentAnswers.length < 5) {
    const contentQ = CONTENT_QUESTIONS[ageGroup];
    for (let i = contentAnswers.length; i < 5; i++) {
      if (contentQ && contentQ[i]) {
        contentAnswers[i] = Math.floor(Math.random() * contentQ[i].options.length);
      } else {
        contentAnswers[i] = 0;
      }
    }
  }
  
  // Generate compatible preferences
  const preferences = {
    lookingFor: existingUsers.length > 0 
      ? existingUsers[Math.floor(Math.random() * existingUsers.length)].preferences?.lookingFor || 'Relationship'
      : 'Relationship',
    ageRange: [Math.max(18, age - 5), Math.min(50, age + 8)],
    distance: 25,
    genderPreference: ['Everyone'],
    dealBreakers: []
  };
  
  // Create unique name - Sarah Martinez will be first (index 0)
  const names = ['Sarah', 'David', 'Emily', 'Michael', 'Jessica', 'Chris', 'Amanda', 'Ryan'];
  const lastNames = ['Martinez', 'Chen', 'Kumar', 'Patel', 'Kim', 'Nguyen', 'Anderson', 'Brown'];
  const name = `${names[index % names.length]} ${lastNames[index % lastNames.length]}`;
  
  // Determine if this is the AI bot (Sarah Martinez at index 0)
  const isSarahMartinez = index === 0 && name.toLowerCase().includes('sarah') && name.toLowerCase().includes('martinez');
  
  // Create email
  const email = `match${index + 1}_${Date.now()}@vibematch.com`;
  
  // Generate bio based on age group - special bio for AI bot
  let bio;
  if (isSarahMartinez) {
    bio = '🤖 AI Bot - I\'m an AI-powered assistant here to help you discover great matches! I automatically engage with users to make your dating experience more interactive and fun.';
  } else {
    const bios = {
      'Gen Z': [
        'Adventure seeker and content creator. Love connecting with people who share my vibe!',
        'Passionate about music, travel, and authentic connections. Let\'s explore together!',
        'Digital native who values real conversations and genuine relationships.'
      ],
      'Millennials': [
        'Professional who loves deep conversations and meaningful connections. Coffee enthusiast!',
        'Seeking someone who shares my values and sense of adventure. Let\'s build something great together!',
        'Passionate about personal growth, travel, and authentic relationships.'
      ],
      'Gen Alpha': [
        'Tech-savvy creator looking for like-minded people. Always exploring new ideas!',
        'Gaming and digital art enthusiast. Love connecting with creative souls!',
        'Student and innovator. Looking for someone who shares my curiosity and passion.'
      ]
    };
    
    const bioOptions = bios[ageGroup] || bios['Gen Z'];
    bio = bioOptions[index % bioOptions.length];
  }
  
  // Profile photo
  const photoUrls = [
    'https://i.pravatar.cc/300?img=16',
    'https://i.pravatar.cc/300?img=17',
    'https://i.pravatar.cc/300?img=18',
    'https://i.pravatar.cc/300?img=19',
    'https://i.pravatar.cc/300?img=20'
  ];
  
  // Validate all answers are present
  if (valueAnswers.length !== 10) {
    console.warn(`Profile ${name} has ${valueAnswers.length} value answers, expected 10`);
  }
  if (contentAnswers.length !== 5) {
      // Profile validation warning
  }
  
  const credentials = getTestCredentials();
  const profile = {
    id: generateId(),
    email,
    password: credentials.matching.password, // From .env.local - see ENV_SETUP.md
    name,
    age,
    gender: ['Female', 'Male', 'Non-binary'][index % 3],
    location: analysis.mostCommonLocation,
    photoUrl: photoUrls[index % photoUrls.length],
    ageGroup,
    valueAnswers: valueAnswers.slice(0, 10), // Ensure exactly 10
    contentAnswers: contentAnswers.slice(0, 5), // Ensure exactly 5
    preferences,
    createdAt: new Date().toISOString(),
    bio,
    isAIBot: isSarahMartinez, // Mark Sarah Martinez as AI Bot
    botProfile: isSarahMartinez ? { ...DEFAULT_BOT_PROFILE } : undefined // Initialize bot profile
  };
  
  // Final validation - ensure all questions answered
  if (profile.valueAnswers.length === 10 && profile.contentAnswers.length === 5) {
    return profile;
  } else {
      // Profile incomplete, regenerating...
    // If incomplete, return a guaranteed complete fallback
    return createFallbackProfile(index);
  }
}

/**
 * Fallback profile if analysis fails
 */
function createFallbackProfile(index) {
  const ageGroup = 'Gen Z';
  const contentQ = CONTENT_QUESTIONS[ageGroup];
  
  // Ensure all 10 value questions answered
  const valueAnswers = VALUE_QUESTIONS.map((question, idx) => {
    return Math.floor(Math.random() * question.options.length);
  });
  
  // Ensure all 5 content questions answered
  const contentAnswers = contentQ ? contentQ.map((question, idx) => {
    return Math.floor(Math.random() * question.options.length);
  }) : Array(5).fill(0);
  
  const credentials = getTestCredentials();
  return {
    id: generateId(),
    email: `match${index + 1}_fallback@vibematch.com`,
    password: credentials.matching.password, // From .env.local - see ENV_SETUP.md
    name: `Match User ${index + 1}`,
    age: 25 + index * 3,
    gender: ['Female', 'Male', 'Non-binary'][index % 3],
    location: 'New York',
    photoUrl: `https://i.pravatar.cc/300?img=${16 + index}`,
    ageGroup: ageGroup,
    valueAnswers: valueAnswers, // All 10 answered
    contentAnswers: contentAnswers, // All 5 answered
    preferences: {
      lookingFor: 'Relationship',
      ageRange: [22, 30],
      distance: 25,
      genderPreference: ['Everyone'],
      dealBreakers: []
    },
    createdAt: new Date().toISOString(),
    bio: 'Looking for meaningful connections!'
  };
}

