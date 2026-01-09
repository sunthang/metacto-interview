import { API_URL } from '../config/constants';
import { Alert } from 'react-native';
import { getToken } from './auth';

/**
 * Gets authorization header with token
 */
const getAuthHeaders = async () => {
  const token = await getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Fetches all features from the API
 * Includes auth token if available to get vote status
 * @returns {Promise<Array>} Array of feature objects
 */
export const fetchFeatures = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/features`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to fetch features');
    return await response.json();
  } catch (error) {
    Alert.alert('Error', 'Failed to load features. Make sure the server is running.');
    throw error;
  }
};

/**
 * Upvotes a feature by ID
 * @param {number} id - Feature ID
 * @returns {Promise<Object>} Updated feature object
 */
export const upvoteFeature = async (id) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/features/${id}/upvote`, {
      method: 'POST',
      headers
    });
    
    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error || 'Failed to upvote';
      
      // Handle specific error cases
      if (response.status === 403) {
        Alert.alert('Cannot Upvote', 'You cannot upvote your own feature');
      } else if (response.status === 409) {
        Alert.alert('Already Voted', 'You have already voted for this feature');
      } else if (response.status === 401) {
        Alert.alert('Authentication Required', 'Please log in to vote');
      } else {
        Alert.alert('Error', errorMessage);
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    // Error already handled above
    throw error;
  }
};

/**
 * Creates a new feature
 * @param {string} name - Feature name
 * @returns {Promise<Object>} Created feature object
 */
export const createFeature = async (name) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/features`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: name.trim() })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create feature');
    }

    return await response.json();
  } catch (error) {
    Alert.alert('Error', error.message || 'Failed to create feature');
    throw error;
  }
};
