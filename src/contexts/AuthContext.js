import React, {createContext, useState, useEffect} from 'react';
import {Alert} from 'react-native';

import storage from '../utils/storage'; // AsyncStorage helper
import {authService} from '../services/authService'; // API calls for login/logout

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token and restore user on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await storage.getToken();
        if (token) {
          const userProfile = await authService.getUserProfile(token);
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Failed to load auth token', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Login function calls API, stores token, sets user
  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await authService.login(username, password);
      if (response.token) {
        await storage.saveToken(response.token);
        setUser(response.user);
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      Alert.alert(
        'Login Error',
        error.message || 'Unexpected error during login',
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout clears stored token and user state
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
    await storage.clearToken();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
