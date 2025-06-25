import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {AuthContext} from '../../contexts/AuthContext';

export default function HomeScreen() {
  const {user, logout} = useContext(AuthContext);

  return (
    <View style={styles.container} accessibilityRole="header">
      <View style={styles.header}>
        {user && user.avatar ? (
          <Image
            source={{uri: user.avatar}}
            style={styles.avatar}
            accessibilityLabel={`${user.username}'s avatar`}
          />
        ) : (
          <View
            style={styles.avatarPlaceholder}
            accessibilityLabel="User avatar placeholder">
            <Text style={styles.avatarPlaceholderText}>
              {user?.username?.[0] || '?'}
            </Text>
          </View>
        )}
        <Text style={styles.welcomeText}>
          Welcome, {user?.username || 'User'}!
        </Text>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.message}>
          This is the home screen. You are successfully logged in.
        </Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          // accessibilityRole="button"
          accessibilityLabel="Logout button">
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff', // soft lavender background
    paddingHorizontal: 24,
    paddingTop: 64,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholderText: {
    color: 'white',
    fontSize: 48,
    fontWeight: '900',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e293b',
  },
  mainContent: {
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 32,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
