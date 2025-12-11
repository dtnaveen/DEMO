// Value-based questions (10 questions)
export const VALUE_QUESTIONS = [
  {
    id: 'friday_night',
    question: "What's your ideal Friday night?",
    options: ['Quiet night in', 'Party with friends', 'Exploring new places', 'Creative project']
  },
  {
    id: 'conflict',
    question: "How do you handle conflict?",
    options: ['Direct conversation', 'Need time to process', 'Avoid confrontation', 'Seek compromise']
  },
  {
    id: 'relationship_important',
    question: "What's most important in a relationship?",
    options: ['Trust', 'Communication', 'Adventure', 'Stability']
  },
  {
    id: 'communication_style',
    question: "Your communication style?",
    options: ['Text constantly', 'Quality calls', 'In-person only', 'Mix of everything']
  },
  {
    id: 'recharge',
    question: "How do you recharge?",
    options: ['Alone time', 'With loved ones', 'Physical activity', 'Creative outlets']
  },
  {
    id: 'life_approach',
    question: "Your approach to life?",
    options: ['Plan everything', 'Go with flow', 'Structured flexibility', 'Spontaneous always']
  },
  {
    id: 'drives_you',
    question: "What drives you?",
    options: ['Career success', 'Personal growth', 'Relationships', 'Making impact']
  },
  {
    id: 'deal_stress',
    question: "Deal with stress by?",
    options: ['Talking it out', 'Exercise', 'Distraction', 'Problem-solving']
  },
  {
    id: 'love_language',
    question: "Your love language?",
    options: ['Words', 'Quality time', 'Gifts', 'Acts of service', 'Physical touch']
  },
  {
    id: 'future_goals',
    question: "Future goals?",
    options: ['Career focused', 'Family oriented', 'Adventure seeking', 'Self-discovery']
  }
];

// Age-specific content questions
export const CONTENT_QUESTIONS = {
  'Gen Z': [
    {
      id: 'social_platform',
      question: 'Favorite social platform?',
      options: ['TikTok', 'Instagram', 'Twitter/X', 'BeReal', 'Reddit']
    },
    {
      id: 'content_consume',
      question: 'Content you consume?',
      options: ['Short-form video', 'Memes', 'Podcasts', 'Gaming streams', 'Educational content']
    },
    {
      id: 'music_vibe',
      question: 'Music vibe?',
      options: ['Pop', 'Hip-hop', 'Indie', 'EDM', 'Alternative', 'K-pop']
    },
    {
      id: 'humor_style',
      question: 'Humor style?',
      options: ['Memes', 'Sarcasm', 'Dark humor', 'Wholesome', 'Absurd']
    },
    {
      id: 'weekend_activity',
      question: 'Weekend activity?',
      options: ['Concerts', 'Thrifting', 'Gaming', 'Content creation', 'Outdoor adventures']
    }
  ],
  'Millennials': [
    {
      id: 'preferred_platform',
      question: 'Preferred platform?',
      options: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter/X', 'YouTube']
    },
    {
      id: 'content_type',
      question: 'Content type?',
      options: ['Long-form articles', 'Podcasts', 'Documentaries', 'Blogs', 'News']
    },
    {
      id: 'music_preference',
      question: 'Music preference?',
      options: ['Rock', 'Pop', 'Hip-hop', 'Jazz', 'Electronic', 'Country']
    },
    {
      id: 'entertainment',
      question: 'Entertainment?',
      options: ['Netflix binges', 'Live music', 'Cooking', 'Travel', 'Fitness']
    },
    {
      id: 'social_style',
      question: 'Social style?',
      options: ['Dinner parties', 'Bars', 'Outdoor activities', 'Cultural events', 'Quiet gatherings']
    }
  ],
  'Gen Alpha': [
    {
      id: 'platform',
      question: 'Platform?',
      options: ['TikTok', 'YouTube Shorts', 'Discord', 'Snapchat', 'Twitch']
    },
    {
      id: 'content',
      question: 'Content?',
      options: ['Gaming', 'Animation', 'Tech reviews', 'Vlogs', 'Challenges']
    },
    {
      id: 'interests',
      question: 'Interests?',
      options: ['Gaming', 'Digital art', 'Coding', 'Anime', 'Sports', 'Music production']
    },
    {
      id: 'music_vibe_alpha',
      question: 'Music vibe?',
      options: ['Pop', 'Hip-hop', 'Electronic', 'K-pop', 'Indie', 'Rock']
    },
    {
      id: 'weekend_gen_alpha',
      question: 'Weekend activity?',
      options: ['Gaming tournaments', 'Content creation', 'Online communities', 'Streaming', 'Tech projects']
    }
  ]
};

// Gender options
export const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

// Looking for options - comprehensive relationship types
export const LOOKING_FOR = [
  'Relationship',
  'Dating',
  'Friends',
  'Networking',
  'Fling',
  'Casual Dating',
  'Serious Relationship',
  'Marriage',
  'Open Relationship',
  'Polyamorous',
  'Something Casual',
  'Long-term Partner',
  'Activity Partner',
  'Travel Buddy',
  'Study Buddy',
  'Business Partner',
  'Hook-up',
  'Just Chatting'
];

// Gender preferences
export const GENDER_PREFERENCES = ['Male', 'Female', 'Non-binary', 'Everyone'];

// Deal breakers
export const DEAL_BREAKERS = [
  'Must share my values on communication',
  'Must enjoy similar content',
  'Must have similar social energy',
  'Must align on future goals'
];

// Age group detection
export function getAgeGroup(age) {
  if (age >= 18 && age <= 27) {
    return 'Gen Z';
  } else if (age >= 28 && age <= 43) {
    return 'Millennials';
  } else {
    return 'Gen Alpha';
  }
}

// Education levels
export const EDUCATION_LEVELS = [
  'High School',
  'Some College',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
  'Trade School',
  'Other',
  'Prefer not to say'
];

// Lifestyle options
export const LIFESTYLE_OPTIONS = {
  exercise: ['Daily', 'Several times a week', 'Weekly', 'Rarely', 'Never'],
  diet: ['Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 'No restrictions', 'Other'],
  drinking: ['Never', 'Rarely', 'Socially', 'Regularly', 'Prefer not to say'],
  smoking: ['Never', 'Rarely', 'Socially', 'Regularly', 'Prefer not to say'],
  pets: ['Love pets', 'Have pets', 'Allergic', 'Not a pet person', 'Prefer not to say'],
  children: ['Want children', 'Have children', "Don't want children", 'Not sure', 'Prefer not to say']
};

// Occupation categories
export const OCCUPATION_CATEGORIES = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Arts & Entertainment',
  'Business',
  'Science & Research',
  'Law',
  'Engineering',
  'Marketing',
  'Sales',
  'Hospitality',
  'Retail',
  'Student',
  'Entrepreneur',
  'Freelancer',
  'Other',
  'Prefer not to say'
];

// Niche filters by age group
export const NICHE_FILTERS = {
  'Gen Z': [
    { id: 'platform_preference', label: 'Platform Preference' },
    { id: 'content_creator', label: 'Content Creator Interest' },
    { id: 'gaming_interest', label: 'Gaming Interest' }
  ],
  'Millennials': [
    { id: 'career_focused', label: 'Career-focused' },
    { id: 'family_oriented', label: 'Family-oriented' },
    { id: 'travel_enthusiast', label: 'Travel Enthusiast' }
  ],
  'Gen Alpha': [
    { id: 'digital_native', label: 'Digital Native' },
    { id: 'gaming_culture', label: 'Gaming Culture' },
    { id: 'tech_savvy', label: 'Tech-savvy' }
  ]
};
