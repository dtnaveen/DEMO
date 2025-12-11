import API_BASE_URL, {API_ENDPOINTS} from '../config/api';
import axios from 'axios';

export async function login(email, password) {
  try {
    const response = await axios.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export async function register(userData) {
  try {
    const response = await axios.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

export async function logout() {
  try {
    await axios.post(API_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

