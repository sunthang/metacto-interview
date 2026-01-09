import { StyleSheet, TextInput, Pressable, Text, View, Alert } from 'react-native';

/**
 * Form component for adding new features
 * @param {string} value - Current input value
 * @param {Function} onChangeText - Callback when input text changes
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {boolean} submitting - Submission loading state
 */
export default function AddFeatureForm({ value, onChangeText, onSubmit, submitting }) {
  const handleSubmit = () => {
    if (!value.trim()) {
      Alert.alert('Error', 'Please enter a feature name');
      return;
    }
    onSubmit();
  };

  return (
    <View style={styles.inputSection} accessibilityRole="form">
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="add your own feature!"
        placeholderTextColor="#666"
        accessibilityLabel="Feature name input"
        accessibilityHint="Enter the name of a new feature to add"
        editable={!submitting}
      />
      <Pressable
        style={({ pressed }) => [
          styles.postButton,
          pressed && styles.postButtonPressed,
          submitting && styles.postButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={submitting}
        accessibilityLabel="Post feature"
        accessibilityRole="button"
        accessibilityHint="Submits the new feature"
      >
        <Text style={styles.postButtonText}>
          {submitting ? 'Posting...' : 'Post'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#0066CC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  postButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  postButtonPressed: {
    backgroundColor: '#0052A3',
  },
  postButtonDisabled: {
    backgroundColor: '#999999',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
