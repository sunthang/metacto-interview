import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { upvoteFeature } from '../services/api';

/**
 * Individual feature row component displaying name, vote count, creator, and upvote button
 * @param {Object} feature - Feature object with id, name, votes, created_by, creator_username
 * @param {Function} onUpvote - Callback function when upvote succeeds (for refresh)
 * @param {Object} currentUser - Current logged in user object with id
 * @param {boolean} hasVoted - Whether current user has already voted for this feature
 */
export default function FeatureRow({ feature, onUpvote, currentUser, hasVoted }) {
  const [isVoting, setIsVoting] = useState(false);
  const isCreator = currentUser && feature.created_by === currentUser.id;
  const isDisabled = isCreator || hasVoted || isVoting;

  /**
   * Handles upvote action
   */
  const handleUpvote = async () => {
    if (hasVoted || isCreator || isVoting) {
      return; // Prevent action if already voted, is creator, or currently voting
    }
    setIsVoting(true);
    try {
      const updatedFeature = await upvoteFeature(feature.id);
      // Pass updated feature to parent for immediate state update
      // WebSocket will handle updates from other clients
      if (onUpvote) {
        onUpvote(updatedFeature);
      }
    } catch (error) {
      // Error handling is done in the API service
      // Don't update state on error
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <View style={styles.featureRow} accessibilityRole="listitem">
      <View style={styles.featureInfo}>
        <Text style={styles.featureName} accessibilityLabel={`Feature: ${feature.name}`}>
          {feature.name}
        </Text>
        {feature.creator_username && (
          <Text style={styles.creatorText} accessibilityLabel={`Created by ${feature.creator_username}`}>
            by {feature.creator_username}
          </Text>
        )}
      </View>
      <View style={styles.voteSection}>
        <Text style={styles.voteCount} accessibilityLabel={`${feature.votes} votes`}>
          {feature.votes}
        </Text>
        {hasVoted ? (
          <View style={styles.votedButton} accessibilityLabel="Already voted">
            <Text style={styles.checkmark}>✓</Text>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.upvoteButton,
              pressed && styles.upvoteButtonPressed,
              isDisabled && styles.upvoteButtonDisabled
            ]}
            onPress={handleUpvote}
            disabled={isDisabled}
            accessibilityLabel={`Upvote ${feature.name}`}
            accessibilityRole="button"
            accessibilityHint={
              isCreator 
                ? "Cannot upvote your own feature" 
                : "Increases the vote count for this feature"
            }
          >
            <Text style={[styles.upvoteButtonText, isDisabled && styles.upvoteButtonTextDisabled]}>
              +1
            </Text>
          </Pressable>
        )}
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
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 4,
  },
  creatorText: {
    fontSize: 14,
    color: '#666666',
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
  upvoteButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  upvoteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  upvoteButtonTextDisabled: {
    color: '#666666',
  },
  votedButton: {
    backgroundColor: '#28A745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
