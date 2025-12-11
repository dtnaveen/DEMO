/**
 * Create all test users for comprehensive login testing
 */
import { getAllUsers, setAllUsers } from './localStorage';
import { generateId } from '../utils/helpers';
import { getAgeGroup } from './constants';
import { getCoordinatesFromLocation } from './gpsUtils';
import { SUBSCRIPTION_TIERS } from './subscription';
import { getTestCredentials } from './testCredentials';

/**
 * Create all test users for login testing
 */
export function setupAllTestUsers() {
  if (typeof window === 'undefined') return;
  
  try {
    const allUsers = getAllUsers();
    const credentials = getTestCredentials();
    
    // 1. Admin User
    let adminUser = allUsers.find(u => 
      u.email === credentials.admin.email || u.role === 'admin'
    );
    
    if (!adminUser) {
      adminUser = {
        id: 'admin-' + Date.now(),
        email: credentials.admin.email,
        password: credentials.admin.password,
        name: 'Admin User',
        role: 'admin',
        age: 30,
        gender: 'Other',
        location: 'Admin HQ',
        latitude: getCoordinatesFromLocation('New York').latitude,
        longitude: getCoordinatesFromLocation('New York').longitude,
        photoUrl: '',
        bio: 'System Administrator',
        ageGroup: getAgeGroup(30),
        subscriptionTier: SUBSCRIPTION_TIERS.VIP,
        verified: true,
        valueAnswers: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0],
        contentAnswers: [0, 1, 2, 0, 1],
        preferences: {
          lookingFor: 'Relationship',
          ageRange: [18, 99],
          distance: 100,
          genderPreference: ['Everyone'],
          dealBreakers: []
        },
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isAIBot: false
      };
      allUsers.push(adminUser);
    }
    
    // 2. Free User
    let freeUser = allUsers.find(u => u.email === credentials.free.email);
    if (!freeUser) {
      const freeCoords = getCoordinatesFromLocation('San Francisco');
      freeUser = {
        id: generateId(),
        email: credentials.free.email,
        password: credentials.free.password,
        name: 'Free User',
        age: 28,
        gender: 'Male',
        location: 'San Francisco',
        latitude: freeCoords.latitude,
        longitude: freeCoords.longitude,
        photoUrl: 'https://i.pravatar.cc/300?img=12',
        ageGroup: getAgeGroup(28),
        valueAnswers: [1, 2, 0, 1, 2, 0, 1, 2, 0, 1],
        contentAnswers: [1, 2, 0, 1, 2],
        preferences: {
          lookingFor: 'Relationship',
          ageRange: [24, 35],
          distance: 30,
          genderPreference: ['Everyone'],
          dealBreakers: []
        },
        createdAt: new Date().toISOString(),
        bio: 'Free account user - testing basic features',
        subscriptionTier: SUBSCRIPTION_TIERS.FREE,
        isAIBot: false
      };
      allUsers.push(freeUser);
    } else {
      freeUser.subscriptionTier = SUBSCRIPTION_TIERS.FREE;
    }
    
    // 3. Premium User (VIP tier)
    let premiumUser = allUsers.find(u => u.email === credentials.premium.email);
    if (!premiumUser) {
      const premiumCoords = getCoordinatesFromLocation('Los Angeles');
      premiumUser = {
        id: generateId(),
        email: credentials.premium.email,
        password: credentials.premium.password,
        name: 'Premium User',
        age: 26,
        gender: 'Female',
        location: 'Los Angeles',
        latitude: premiumCoords.latitude,
        longitude: premiumCoords.longitude,
        photoUrl: 'https://i.pravatar.cc/300?img=15',
        ageGroup: getAgeGroup(26),
        valueAnswers: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0],
        contentAnswers: [0, 1, 2, 0, 1],
        preferences: {
          lookingFor: 'Relationship',
          ageRange: [22, 32],
          distance: 25,
          genderPreference: ['Everyone'],
          dealBreakers: []
        },
        createdAt: new Date().toISOString(),
        bio: 'Premium account user - testing all premium features',
        subscriptionTier: SUBSCRIPTION_TIERS.VIP,
        premiumSince: new Date().toISOString(),
        isAIBot: false
      };
      allUsers.push(premiumUser);
    } else {
      premiumUser.subscriptionTier = SUBSCRIPTION_TIERS.VIP;
    }
    
    // 4. Basic Tier User
    let basicUser = allUsers.find(u => u.email === credentials.basic.email);
    if (!basicUser) {
      const basicCoords = getCoordinatesFromLocation('Chicago');
      basicUser = {
        id: generateId(),
        email: credentials.basic.email,
        password: credentials.basic.password,
        name: 'Basic User',
        age: 29,
        gender: 'Male',
        location: 'Chicago',
        latitude: basicCoords.latitude,
        longitude: basicCoords.longitude,
        photoUrl: 'https://i.pravatar.cc/300?img=20',
        ageGroup: getAgeGroup(29),
        valueAnswers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        contentAnswers: [1, 1, 1, 1, 1],
        preferences: {
          lookingFor: 'Relationship',
          ageRange: [25, 35],
          distance: 20,
          genderPreference: ['Everyone'],
          dealBreakers: []
        },
        createdAt: new Date().toISOString(),
        bio: 'Basic tier user',
        subscriptionTier: SUBSCRIPTION_TIERS.BASIC,
        isAIBot: false
      };
      allUsers.push(basicUser);
    } else {
      basicUser.subscriptionTier = SUBSCRIPTION_TIERS.BASIC;
    }
    
    // 5. Plus Tier User
    let plusUser = allUsers.find(u => u.email === credentials.plus.email);
    if (!plusUser) {
      const plusCoords = getCoordinatesFromLocation('Miami');
      plusUser = {
        id: generateId(),
        email: credentials.plus.email,
        password: credentials.plus.password,
        name: 'Plus User',
        age: 27,
        gender: 'Female',
        location: 'Miami',
        latitude: plusCoords.latitude,
        longitude: plusCoords.longitude,
        photoUrl: 'https://i.pravatar.cc/300?img=25',
        ageGroup: getAgeGroup(27),
        valueAnswers: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        contentAnswers: [2, 2, 2, 2, 2],
        preferences: {
          lookingFor: 'Relationship',
          ageRange: [23, 30],
          distance: 15,
          genderPreference: ['Everyone'],
          dealBreakers: []
        },
        createdAt: new Date().toISOString(),
        bio: 'Plus tier user',
        subscriptionTier: SUBSCRIPTION_TIERS.PLUS,
        premiumSince: new Date().toISOString(),
        isAIBot: false
      };
      allUsers.push(plusUser);
    } else {
      plusUser.subscriptionTier = SUBSCRIPTION_TIERS.PLUS;
    }
    
    // 6. Regular User (Ranjith)
    let ranjithUser = allUsers.find(u => 
      u.name?.toLowerCase().includes('ranjith') || 
      u.email?.toLowerCase().includes('ranjith') ||
      u.email === credentials.regular.email
    );
    if (!ranjithUser) {
      const ranjithCoords = getCoordinatesFromLocation('New York');
      ranjithUser = {
        id: generateId(),
        email: credentials.regular.email,
        password: credentials.regular.password,
        name: 'ranjith',
        age: 25,
        gender: 'Male',
        location: 'New York',
        latitude: ranjithCoords.latitude,
        longitude: ranjithCoords.longitude,
        photoUrl: '',
        ageGroup: getAgeGroup(25),
        valueAnswers: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0],
        contentAnswers: [0, 1, 2, 0, 1],
        preferences: {
          lookingFor: 'Relationship',
          ageRange: [22, 30],
          distance: 25,
          genderPreference: ['Everyone'],
          dealBreakers: []
        },
        createdAt: new Date().toISOString(),
        bio: '',
        subscriptionTier: SUBSCRIPTION_TIERS.FREE,
        isAIBot: false
      };
      allUsers.push(ranjithUser);
    } else {
      ranjithUser.password = credentials.regular.password;
    }
    
    setAllUsers(allUsers);
    
    console.log('✅ All test users created/updated:');
    console.log(`1. Admin: ${credentials.admin.email} / [From .env.local]`);
    console.log(`2. Free: ${credentials.free.email} / [From .env.local]`);
    console.log(`3. Premium (VIP): ${credentials.premium.email} / [From .env.local]`);
    console.log(`4. Basic: ${credentials.basic.email} / [From .env.local]`);
    console.log(`5. Plus: ${credentials.plus.email} / [From .env.local]`);
    console.log(`6. Regular: ${credentials.regular.email} / [From .env.local]`);
    console.log('⚠️  Credentials are stored in .env.local (gitignored) - see ENV_SETUP.md');
    
    return {
      adminUser,
      freeUser,
      premiumUser,
      basicUser,
      plusUser,
      ranjithUser
    };
  } catch (error) {
    console.error('Error setting up all test users:', error);
    return null;
  }
}

