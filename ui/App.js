import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from './components/Header';
import FeatureList from './components/FeatureList';
import AddFeatureForm from './components/AddFeatureForm';
import { fetchFeatures, upvoteFeature, createFeature } from './services/api';

/**
 * Main app component - orchestrates feature voting functionality
 */
export default function App() {
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load features on mount
  useEffect(() => {
    loadFeatures();
  }, []);

  /**
   * Loads all features from the API
   */
  const loadFeatures = async () => {
    try {
      setLoading(true);
      const data = await fetchFeatures();
      setFeatures(data);
    } catch (error) {
      // Error handling is done in the API service
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles upvoting a feature
   * @param {number} id - Feature ID to upvote
   */
  const handleUpvote = async (id) => {
    try {
      const updated = await upvoteFeature(id);
      setFeatures(features.map(f => f.id === id ? updated : f));
    } catch (error) {
      // Error handling is done in the API service
    }
  };

  /**
   * Handles creating a new feature
   */
  const handlePost = async () => {
    try {
      setSubmitting(true);
      const feature = await createFeature(newFeature);
      setFeatures([...features, feature]);
      setNewFeature('');
    } catch (error) {
      // Error handling is done in the API service
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container} accessibilityRole="main">
      <StatusBar style="dark" />
      <Header />
      <FeatureList 
        features={features} 
        loading={loading} 
        onUpvote={handleUpvote} 
      />
      <AddFeatureForm
        value={newFeature}
        onChangeText={setNewFeature}
        onSubmit={handlePost}
        submitting={submitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
