import { StyleSheet, Text, View } from 'react-native';

/**
 * App header component
 */
export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText} accessibilityRole="header">
        Feature Voting
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0066CC',
    padding: 20,
    paddingTop: 60,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
