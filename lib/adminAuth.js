/**
 * Admin Authentication Utilities
 */

import { getCurrentUser, getAllUsers, setAllUsers } from './localStorage';

/**
 * Check if current user is admin
 */
export function isAdmin(user = null) {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  
  // Check if user has admin role
  return currentUser.role === 'admin' || currentUser.email === 'admin@vibematch.com';
}

/**
 * Require admin access (throws error if not admin)
 */
export function requireAdmin(user = null) {
  if (!isAdmin(user)) {
    throw new Error('Admin access required');
  }
}

/**
 * Create admin user
 */
export function createAdminUser() {
  const allUsers = getAllUsers();
  
  // Check if admin already exists
  const existingAdmin = allUsers.find(u => 
    u.email === 'admin@vibematch.com' || u.role === 'admin'
  );
  
  if (existingAdmin) {
    return existingAdmin;
  }
  
  // Create admin user
  const adminUser = {
    id: 'admin-' + Date.now(),
    email: 'admin@vibematch.com',
    password: 'admin123', // Change in production!
    name: 'Admin User',
    role: 'admin',
    age: 30,
    gender: 'other',
    location: 'Admin HQ',
    photoUrl: '',
    bio: 'System Administrator',
    ageGroup: 'millennial',
    subscriptionTier: 'vip',
    verified: true,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };
  
  allUsers.push(adminUser);
  setAllUsers(allUsers);
  
  return adminUser;
}

