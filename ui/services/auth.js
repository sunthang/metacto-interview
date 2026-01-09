import { API_URL } from '../config/constants';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Stores auth token and user info (works for both mobile and web)
 */
const storeAuth = async (token, user) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Web
      window.localStorage.setItem(TOKEN_KEY, token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      // Mobile
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch (error) {
    // Error storing auth - silently fail
  }
};

/**
 * Gets current user info
 */
export const getCurrentUser = async () => {
  try {
    let userStr;
    if (typeof window !== 'undefined' && window.localStorage) {
      // Web
      userStr = window.localStorage.getItem(USER_KEY);
    } else {
      // Mobile
      userStr = await AsyncStorage.getItem(USER_KEY);
    }
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    // Error getting user - return null
    return null;
  }
};

/**
 * Gets auth token (works for both mobile and web)
 */
export const getToken = async () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Web
      return window.localStorage.getItem(TOKEN_KEY);
    } else {
      // Mobile
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
  } catch (error) {
    // Error getting token - return null
    return null;
  }
};

/**
 * Removes auth token and user info
 */
export const removeToken = async () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Web
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    } else {
      // Mobile
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    // Error removing auth - silently fail
  }
};

/**
 * Registers a new user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} User object with token
 */
export const register = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    await storeAuth(data.token, data.user);
    return data;
  } catch (error) {
    Alert.alert('Error', error.message || 'Failed to register');
    throw error;
  }
};

/**
 * Logs in a user
 * @param {string} username - Username
 * @param {string} password - Password
 * @param {boolean} suppressAlert - If true, don't show alert on error
 * @returns {Promise<Object>} User object with token
 */
export const login = async (username, password, suppressAlert = false) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error || 'Login failed';
      if (!suppressAlert) {
        Alert.alert('Error', errorMessage);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    await storeAuth(data.token, data.user);
    return data;
  } catch (error) {
    if (!suppressAlert) {
      Alert.alert('Error', error.message || 'Failed to login');
    }
    throw error;
  }
};

/**
 * Combined login/register - tries login first, registers if user doesn't exist
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} User object with token
 */
export const loginOrRegister = async (username, password) => {
  try {
    // Try login first (suppress alert since we'll try registration if it fails)
    return await login(username, password, true);
  } catch (error) {
    // If login fails with 401 or "Invalid credentials", try registering
    if (error.message.includes('Invalid') || error.message.includes('credentials')) {
      try {
        return await register(username, password);
      } catch (registerError) {
        // Only show alert if registration also fails
        Alert.alert('Error', registerError.message || 'Failed to create account');
        throw registerError;
      }
    }
    // For other errors, show alert and rethrow
    Alert.alert('Error', error.message || 'Authentication failed');
    throw error;
  }
};

/**
 * Logs out the current user by removing auth token and user data
 */
export const logout = async () => {
  await removeToken();
};
