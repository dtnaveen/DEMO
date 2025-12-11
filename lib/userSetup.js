import { getAllUsers, setAllUsers, getCurrentUser } from './localStorage';
import { generateId, devLog } from '../utils/helpers';
import { getAgeGroup } from './constants';
import { getCoordinatesFromLocation } from './gpsUtils';

/**
 * Ensure user "ranjith" exists with the specified password
 */
export function setupRanjithUser() {
  if (typeof window === 'undefined') return;
  
  try {
    const allUsers = getAllUsers();
    const ranjithLower = 'ranjith';
    
    // Check if user exists (by name or email)
    let ranjithUser = allUsers.find(u => 
      u.name?.toLowerCase().includes(ranjithLower) || 
      u.email?.toLowerCase().includes(ranjithLower)
    );
    
    if (!ranjithUser) {
      // Create user if they don't exist
      const ranjithCoords = getCoordinatesFromLocation('New York');
      ranjithUser = {
        id: generateId(),
        email: 'ranjith@example.com',
        password: '1234567890',
        name: 'ranjith',
        age: 25,
        gender: 'Male',
        location: 'New York',
        latitude: ranjithCoords.latitude,
        longitude: ranjithCoords.longitude,
        photoUrl: '',
        ageGroup: getAgeGroup(25),
        valueAnswers: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0], // Default answers
        contentAnswers: [0, 1, 2, 0, 1], // Default answers
        preferences: {
          lookingFor: 'Relationship',
          ageRange: [22, 30],
          distance: 25,
          genderPreference: ['Everyone'],
          dealBreakers: []
        },
        createdAt: new Date().toISOString(),
        bio: '',
        isAIBot: false, // Ranjith is a real user
        subscriptionTier: 'free' // Default to free tier
      };
      
      allUsers.push(ranjithUser);
      setAllUsers(allUsers);
      // User created successfully
    } else {
      // Update password and GPS coordinates if user exists
      ranjithUser.password = '1234567890';
      if (!ranjithUser.latitude || !ranjithUser.longitude) {
        const coords = getCoordinatesFromLocation(ranjithUser.location || 'New York');
        ranjithUser.latitude = coords.latitude;
        ranjithUser.longitude = coords.longitude;
      }
      const updatedUsers = allUsers.map(u => 
        u.id === ranjithUser.id ? ranjithUser : u
      );
      setAllUsers(updatedUsers);
      // Password and GPS coordinates updated successfully
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up ranjith user:', error);
    return false;
  }
}

