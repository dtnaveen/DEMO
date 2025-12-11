import { VALUE_QUESTIONS, CONTENT_QUESTIONS, GENDERS, LOOKING_FOR, GENDER_PREFERENCES, getAgeGroup } from './constants';
import { devLog } from '../utils/helpers';
import { getCoordinatesFromLocation } from './gpsUtils';

// Mock names for realistic users
const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Cameron', 'Avery',
  'Emma', 'Noah', 'Olivia', 'Liam', 'Sophia', 'Mason', 'Isabella', 'Ethan',
  'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry',
  'Evelyn', 'Alexander', 'Abigail', 'Michael', 'Emily', 'Daniel'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark'
];

const CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Columbus',
  'Fort Worth', 'Charlotte', 'Seattle', 'Denver', 'Boston', 'Nashville', 'Miami', 'Atlanta'
];

// Profile photo URLs (using placeholder services)
const PROFILE_PHOTOS = [
  'https://i.pravatar.cc/300?img=1',
  'https://i.pravatar.cc/300?img=2',
  'https://i.pravatar.cc/300?img=3',
  'https://i.pravatar.cc/300?img=4',
  'https://i.pravatar.cc/300?img=5',
  'https://i.pravatar.cc/300?img=6',
  'https://i.pravatar.cc/300?img=7',
  'https://i.pravatar.cc/300?img=8',
  'https://i.pravatar.cc/300?img=9',
  'https://i.pravatar.cc/300?img=10',
  'https://i.pravatar.cc/300?img=11',
  'https://i.pravatar.cc/300?img=12',
  'https://i.pravatar.cc/300?img=13',
  'https://i.pravatar.cc/300?img=14',
  'https://i.pravatar.cc/300?img=15'
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[randomInt(0, array.length - 1)];
}

function randomChoices(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Generate a single mock user
 */
function generateMockUser() {
  const age = randomInt(18, 43);
  const ageGroup = getAgeGroup(age);
  const firstName = randomChoice(FIRST_NAMES);
  const lastName = randomChoice(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  
  // Generate value answers (10 questions)
  const valueAnswers = VALUE_QUESTIONS.map(() => {
    // Weight towards similar answers for some questions to create better matches
    return randomInt(0, 3);
  });
  
  // Adjust some answers to create clusters of compatibility
  if (Math.random() > 0.5) {
    valueAnswers[0] = randomChoice([0, 1]); // Friday night preference cluster
  }
  
  // Generate content answers based on age group
  const contentQuestions = CONTENT_QUESTIONS[ageGroup];
  const contentAnswers = contentQuestions.map(() => {
    return randomInt(0, 3);
  });
  
  // Generate preferences
  const preferences = {
    lookingFor: randomChoice(LOOKING_FOR),
    ageRange: [Math.max(18, age - 5), Math.min(50, age + 8)],
    distance: randomInt(10, 50),
    genderPreference: randomChoices(GENDER_PREFERENCES, randomInt(1, 3)),
    dealBreakers: randomChoices([
      'Must share my values on communication',
      'Must enjoy similar content',
      'Must have similar social energy',
      'Must align on future goals'
    ], randomInt(0, 2))
  };
  
  const location = randomChoice(CITIES);
  const coords = getCoordinatesFromLocation(location);
  
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    name,
    age,
    gender: randomChoice(GENDERS),
    location: location,
    latitude: coords.latitude,
    longitude: coords.longitude,
    photoUrl: randomChoice(PROFILE_PHOTOS),
    ageGroup,
    valueAnswers,
    contentAnswers,
    preferences,
    createdAt: new Date(Date.now() - randomInt(0, 90) * 24 * 60 * 60 * 1000).toISOString(),
    bio: generateBio(ageGroup, valueAnswers),
    subscriptionTier: 'free' // Default all mock users to free
  };
}

function generateBio(ageGroup, valueAnswers) {
  const bios = {
    'Gen Z': [
      'Love exploring new spots and making content! Always down for an adventure.',
      'Film student by day, meme connoisseur by night. Let\'s vibe!',
      'Passionate about music, art, and good vibes. Looking for someone who gets it.',
      'Gaming enthusiast and digital nomad. Always up for a good conversation!'
    ],
    'Millennials': [
      'Marketing professional who loves traveling and trying new restaurants. Looking for meaningful connections.',
      'Yoga instructor and coffee enthusiast. I value deep conversations and genuine relationships.',
      'Tech worker who enjoys hiking, cooking, and weekend getaways. Let\'s explore together!',
      'Creative professional passionate about sustainability and personal growth. Seeking someone who shares similar values.'
    ],
    'Gen Alpha': [
      'Content creator and tech enthusiast. Always experimenting with new ideas!',
      'Gaming streamer and digital artist. Love connecting with like-minded people.',
      'Student by day, creator by night. Passionate about innovation and creativity.',
      'Tech-savvy and always learning. Looking for someone who shares my curiosity!'
    ]
  };
  
  return randomChoice(bios[ageGroup] || bios['Gen Z']);
}

/**
 * Generate multiple mock users
 * @param {number} count - Number of users to generate
 */
export function generateMockUsers(count = 25) {
  const users = [];
  const usedNames = new Set();
  
  for (let i = 0; i < count; i++) {
    let user = generateMockUser();
    let attempts = 0;
    
    // Ensure unique names
    while (usedNames.has(user.name) && attempts < 10) {
      user = generateMockUser();
      attempts++;
    }
    
    usedNames.add(user.name);
    users.push(user);
    
    // Small delay to ensure unique IDs
    if (i < count - 1) {
      // Simulate time passing for unique timestamps
    }
  }
  
  return users;
}

/**
 * Initialize mock data if not already present
 */
export function initializeMockData() {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = localStorage.getItem('allUsers');
    if (!existing || JSON.parse(existing).length === 0) {
      const mockUsers = generateMockUsers(25);
      localStorage.setItem('allUsers', JSON.stringify(mockUsers));
      devLog('Generated 25 mock users');
    }
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
}
