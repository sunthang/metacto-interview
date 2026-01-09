import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import FeatureRow from './FeatureRow';

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
 * Feature list component displaying all features with loading and empty states
 * @param {Array} features - Array of feature objects
 * @param {boolean} loading - Loading state
 * @param {Function} onUpvote - Callback function when upvote is pressed
 */
export default function FeatureList({ features, loading, onUpvote }) {
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
      renderItem={({ item }) => (
        <FeatureRow feature={item} onUpvote={onUpvote} />
      )}
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
