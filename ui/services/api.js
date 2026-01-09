import { API_URL } from '../config/constants';
import { Alert } from 'react-native';

/**
 * Fetches all features from the API
 * @returns {Promise<Array>} Array of feature objects
 */
export const fetchFeatures = async () => {
  try {
    const response = await fetch(`${API_URL}/features`);
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
    const response = await fetch(`${API_URL}/features/${id}/upvote`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to upvote');
    return await response.json();
  } catch (error) {
    Alert.alert('Error', 'Failed to upvote feature');
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
    const response = await fetch(`${API_URL}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
