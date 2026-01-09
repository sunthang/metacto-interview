import { StyleSheet, Text, View, Pressable } from 'react-native';

/**
 * App header component with logout button
 * @param {Function} onLogout - Callback when logout button is pressed
 */
export default function Header({ onLogout }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText} accessibilityRole="header">
        Feature Voting
      </Text>
      {onLogout && (
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed
          ]}
          onPress={onLogout}
          accessibilityLabel="Logout"
          accessibilityRole="button"
          accessibilityHint="Logs out the current user and returns to login screen"
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0066CC',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  logoutButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
