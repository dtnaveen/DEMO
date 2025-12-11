/**
 * Create test users for Free and Premium accounts
 */
import { getAllUsers, setAllUsers, setCurrentUser } from './localStorage';
import { generateId } from '../utils/helpers';
import { getAgeGroup } from './constants';
import { getCoordinatesFromLocation } from './gpsUtils';

/**
 * Setup test users: one free and one premium
 */
export function setupTestUsers() {
  if (typeof window === 'undefined') return;
  
  try {
    const allUsers = getAllUsers();
    
    // Free test user
    let freeUser = allUsers.find(u => 
      u.email === 'free@test.com' || u.name?.toLowerCase() === 'free user'
    );
    
    if (!freeUser) {
      const freeCoords = getCoordinatesFromLocation('San Francisco');
      freeUser = {
        id: generateId(),
        email: 'free@test.com',
        password: 'free123',
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
        subscriptionTier: 'free',
        isAIBot: false
      };
      allUsers.push(freeUser);
    } else {
      // Update to ensure free tier and GPS coordinates
      freeUser.subscriptionTier = 'free';
      if (!freeUser.latitude || !freeUser.longitude) {
        const coords = getCoordinatesFromLocation(freeUser.location || 'San Francisco');
        freeUser.latitude = coords.latitude;
        freeUser.longitude = coords.longitude;
      }
      const index = allUsers.findIndex(u => u.id === freeUser.id);
      if (index >= 0) {
        allUsers[index] = freeUser;
      }
    }
    
    // Premium test user
    let premiumUser = allUsers.find(u => 
      u.email === 'premium@test.com' || u.name?.toLowerCase() === 'premium user'
    );
    
    if (!premiumUser) {
      const premiumCoords = getCoordinatesFromLocation('Los Angeles');
      premiumUser = {
        id: generateId(),
        email: 'premium@test.com',
        password: 'premium123',
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
        subscriptionTier: 'premium',
        premiumSince: new Date().toISOString(),
        isAIBot: false
      };
      allUsers.push(premiumUser);
    } else {
      // Update to ensure premium tier and GPS coordinates
      premiumUser.subscriptionTier = 'premium';
      premiumUser.premiumSince = premiumUser.premiumSince || new Date().toISOString();
      if (!premiumUser.latitude || !premiumUser.longitude) {
        const coords = getCoordinatesFromLocation(premiumUser.location || 'Los Angeles');
        premiumUser.latitude = coords.latitude;
        premiumUser.longitude = coords.longitude;
      }
      const index = allUsers.findIndex(u => u.id === premiumUser.id);
      if (index >= 0) {
        allUsers[index] = premiumUser;
      }
    }
    
    setAllUsers(allUsers);
    console.log('Test users created/updated:');
    console.log('- Free User: free@test.com / free123');
    console.log('- Premium User: premium@test.com / premium123');
    
    return { freeUser, premiumUser };
  } catch (error) {
    console.error('Error setting up test users:', error);
    return null;
  }
}

/**
 * Login as free test user
 */
export function loginAsFreeUser() {
  if (typeof window === 'undefined') return false;
  
  try {
    const allUsers = getAllUsers();
    const freeUser = allUsers.find(u => u.email === 'free@test.com');
    
    if (freeUser) {
      const { password, ...userWithoutPassword } = freeUser;
      setCurrentUser(userWithoutPassword);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error logging in as free user:', error);
    return false;
  }
}

/**
 * Login as premium test user
 */
export function loginAsPremiumUser() {
  if (typeof window === 'undefined') return false;
  
  try {
    const allUsers = getAllUsers();
    const premiumUser = allUsers.find(u => u.email === 'premium@test.com');
    
    if (premiumUser) {
      const { password, ...userWithoutPassword } = premiumUser;
      setCurrentUser(userWithoutPassword);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error logging in as premium user:', error);
    return false;
  }
}

