import API_BASE_URL, {API_ENDPOINTS} from '../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getCurrentUser() {
  try {
    const response = await api.get(API_ENDPOINTS.CURRENT_USER);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
}

export async function updateUser(userData) {
  try {
    const response = await api.put(API_ENDPOINTS.UPDATE_USER, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
}

export async function discoverUsers(filters = {}) {
  try {
    const response = await api.get(API_ENDPOINTS.DISCOVER, {params: filters});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to discover users');
  }
}

export async function likeUser(userId) {
  try {
    const response = await api.post(API_ENDPOINTS.LIKE, {userId});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to like user');
  }
}

export async function passUser(userId) {
  try {
    const response = await api.post(API_ENDPOINTS.PASS, {userId});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to pass user');
  }
}

export async function getMatches() {
  try {
    const response = await api.get(API_ENDPOINTS.MATCHES);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch matches');
  }
}

export async function getConversations() {
  try {
    const response = await api.get(API_ENDPOINTS.CONVERSATIONS);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
  }
}

export async function getMessages(userId) {
  try {
    const response = await api.get(API_ENDPOINTS.MESSAGES, {params: {userId}});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
}

export async function sendMessage(userId, text) {
  try {
    const response = await api.post(API_ENDPOINTS.SEND_MESSAGE, {
      userId,
      text,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
}

