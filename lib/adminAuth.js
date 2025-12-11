/**
 * Admin Authentication Utilities
 */

import { getCurrentUser, getAllUsers, setAllUsers } from './localStorage';
import { getTestCredentials } from './testCredentials';

/**
 * Check if current user is admin
 */
export function isAdmin(user = null) {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;
  
  // Check if user has admin role
  const credentials = getTestCredentials();
  return currentUser.role === 'admin' || currentUser.email === credentials.admin.email;
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
  const credentials = getTestCredentials();
  
  // Check if admin already exists
  const existingAdmin = allUsers.find(u => 
    u.email === credentials.admin.email || u.role === 'admin'
  );
  
  if (existingAdmin) {
    return existingAdmin;
  }
  
  // Create admin user
  const adminUser = {
    id: 'admin-' + Date.now(),
    email: credentials.admin.email,
    password: credentials.admin.password, // From .env.local - see ENV_SETUP.md
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

