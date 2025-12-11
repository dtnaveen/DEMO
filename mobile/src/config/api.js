/**
 * API Configuration
 * Update this with your backend API URL
 */

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://api.vibematch.com';  // Production

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  
  // User
  CURRENT_USER: `${API_BASE_URL}/user/me`,
  UPDATE_USER: `${API_BASE_URL}/user/me`,
  UPLOAD_PHOTOS: `${API_BASE_URL}/user/photos`,
  VERIFY_PHOTO: `${API_BASE_URL}/user/verify-photo`,
  
  // Discovery
  DISCOVER: `${API_BASE_URL}/discover`,
  LIKE: `${API_BASE_URL}/discover/like`,
  PASS: `${API_BASE_URL}/discover/pass`,
  
  // Matches
  MATCHES: `${API_BASE_URL}/matches`,
  
  // Messages
  CONVERSATIONS: `${API_BASE_URL}/messages/conversations`,
  MESSAGES: `${API_BASE_URL}/messages`,
  SEND_MESSAGE: `${API_BASE_URL}/messages/send`,
  SEND_VOICE: `${API_BASE_URL}/messages/voice`,
  
  // Video Chat
  VIDEO_CALL_TOKEN: `${API_BASE_URL}/video/token`,
  
  // Safety
  BLOCK_USER: `${API_BASE_URL}/safety/block`,
  REPORT_USER: `${API_BASE_URL}/safety/report`,
  
  // Social Media
  LINK_SOCIAL: `${API_BASE_URL}/social/link`,
  
  // Subscription
  SUBSCRIPTION: `${API_BASE_URL}/subscription`,
  UPGRADE: `${API_BASE_URL}/subscription/upgrade`
};

export default API_BASE_URL;

