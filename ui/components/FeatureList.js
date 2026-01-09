import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import FeatureRow from './FeatureRow';
import { fetchFeatures } from '../services/api';
import { getSocket } from '../services/websocket';

/**
 * Sorts features by votes (descending) then by name (ascending)
 * @param {Array} features - Array of feature objects
 * @returns {Array} Sorted array of features
 */
const sortFeatures = (features) => {
  return [...features].sort((a, b) => 
    b.votes - a.votes || a.name.localeCompare(b.name)
  );
};

/**
 * Feature list component - manages its own data fetching and state
 * @param {Object} currentUser - Current logged in user object with id
 * @param {Function} onRefresh - Callback to trigger refresh (called after operations)
 */
export default function FeatureList({ currentUser, onRefresh }) {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Loads features from API
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

  // Load features on mount
  useEffect(() => {
    loadFeatures();
  }, []);

  // Refresh when onRefresh callback changes (triggered by parent)
  useEffect(() => {
    if (onRefresh) {
      loadFeatures();
    }
  }, [onRefresh]);

  // Listen for WebSocket events - retry until socket is available
  useEffect(() => {
    let retryInterval;
    
    const setupSocketListeners = () => {
      const socket = getSocket();
      if (!socket) {
        // Retry in 500ms if socket not ready
        retryInterval = setTimeout(setupSocketListeners, 500);
        return null;
      }

      // Handle feature_created event
      const handleFeatureCreated = (newFeature) => {
        setFeatures(prev => {
          const exists = prev.some(f => f.id === newFeature.id);
          if (exists) return prev;
          return [...prev, { ...newFeature, has_voted: false }];
        });
      };

      // Handle feature_upvoted event
      const handleFeatureUpvoted = (updatedFeature) => {
        setFeatures(prev => {
          return prev.map(f => {
            if (f.id === updatedFeature.id) {
              const preservedHasVoted = f.has_voted !== undefined ? f.has_voted : false;
              return { ...updatedFeature, has_voted: preservedHasVoted };
            }
            return f;
          });
        });
      };

      socket.on('feature_created', handleFeatureCreated);
      socket.on('feature_upvoted', handleFeatureUpvoted);

      return () => {
        socket.off('feature_created', handleFeatureCreated);
        socket.off('feature_upvoted', handleFeatureUpvoted);
      };
    };

    const cleanup = setupSocketListeners();

    return () => {
      if (retryInterval) clearTimeout(retryInterval);
      if (cleanup) cleanup();
    };
  }, []);

  /**
   * Handles upvote - updates local state immediately
   * WebSocket will handle vote count updates from other clients
   * @param {Object} updatedFeature - Feature object returned from API after upvote
   */
  const handleUpvote = (updatedFeature) => {
    if (updatedFeature) {
      setFeatures(prev => {
        return prev.map(f => {
          if (f.id === updatedFeature.id) {
            return {
              ...updatedFeature,
              has_voted: true
            };
          }
          return f;
        });
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading features...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sortFeatures(features)}
      renderItem={({ item }) => {
        // Ensure has_voted is a boolean (handle 0/1 from SQLite or undefined)
        // Check both item.has_voted and ensure currentUser exists
        const hasVoted = currentUser ? Boolean(item.has_voted === true || item.has_voted === 1 || item.has_voted === '1') : false;
        
        return (
          <FeatureRow 
            feature={item} 
            onUpvote={handleUpvote}
            currentUser={currentUser}
            hasVoted={hasVoted}
          />
        );
      }}
      keyExtractor={(item) => item.id.toString()}
      style={styles.featuresList}
      contentContainerStyle={styles.featuresListContent}
      accessibilityLabel="List of features"
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No features yet. Add one below!</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#333333',
    fontSize: 16,
  },
  featuresList: {
    flex: 1,
  },
  featuresListContent: {
    padding: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666666',
    fontSize: 16,
  },
});
