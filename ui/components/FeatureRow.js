import { StyleSheet, Text, View, Pressable } from 'react-native';

/**
 * Individual feature row component displaying name, vote count, and upvote button
 * @param {Object} feature - Feature object with id, name, and votes
 * @param {Function} onUpvote - Callback function when upvote button is pressed
 */
export default function FeatureRow({ feature, onUpvote }) {
  return (
    <View style={styles.featureRow} accessibilityRole="listitem">
      <Text style={styles.featureName} accessibilityLabel={`Feature: ${feature.name}`}>
        {feature.name}
      </Text>
      <View style={styles.voteSection}>
        <Text style={styles.voteCount} accessibilityLabel={`${feature.votes} votes`}>
          {feature.votes}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.upvoteButton,
            pressed && styles.upvoteButtonPressed
          ]}
          onPress={() => onUpvote(feature.id)}
          accessibilityLabel={`Upvote ${feature.name}`}
          accessibilityRole="button"
          accessibilityHint="Increases the vote count for this feature"
        >
          <Text style={styles.upvoteButtonText}>+1</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  featureName: {
    flex: 1,
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
  },
  voteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voteCount: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
  upvoteButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  upvoteButtonPressed: {
    backgroundColor: '#0052A3',
  },
  upvoteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
