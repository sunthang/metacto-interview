import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from './components/Header';
import FeatureList from './components/FeatureList';
import AddFeatureForm from './components/AddFeatureForm';
import LoginScreen from './components/LoginScreen';
import { getToken, getCurrentUser, logout } from './services/auth';
import { connectWebSocket, disconnectWebSocket } from './services/websocket';

/**
 * Main app component - handles authentication and entry point only
 */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Connect WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }
    
    // Cleanup: disconnect on unmount
    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated]);

  /**
   * Checks if user is authenticated
   */
  const checkAuth = async () => {
    try {
      const token = await getToken();
      const user = await getCurrentUser();
      setIsAuthenticated(!!token);
      setCurrentUser(user);
    } catch (error) {
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  /**
   * Handles successful login
   */
  const handleLogin = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Connect WebSocket after login
    connectWebSocket();
  };

  /**
   * Callback to trigger feature list refresh
   */
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  /**
   * Handles user logout
   */
  const handleLogout = async () => {
    disconnectWebSocket();
    await logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Show login screen if not authenticated
  if (checkingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <View style={styles.container} accessibilityRole="main">
      <StatusBar style="dark" />
      <Header onLogout={handleLogout} />
      <FeatureList 
        currentUser={currentUser}
        onRefresh={refreshTrigger}
      />
      <AddFeatureForm onFeatureCreated={handleRefresh} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
