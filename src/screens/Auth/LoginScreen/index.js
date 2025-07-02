import React, {useState, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import {Text, TextInput, ActivityIndicator} from 'react-native-paper';
import {
  APP_NAME,
  APP_DESC,
  APP_COPYRIGHT,
  APP_DEVELOPER,
  APP_VERSION,
} from 'react-native-dotenv';
import {log} from '../../../utils/logger';
import appLogo from '../../../assets/images/app-icon.png';

import {AuthContext} from '../../../contexts/AuthContext';

export default function LoginScreen() {
  const {login, loading} = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginPress = async () => {
    if (!username.trim() || !password.trim()) {
      log.info('Login - Screen:', 'Username and Password are required');
      Alert.alert('Login Failed', 'Username and Password are required.');
      return;
    }
    try {
      log.info('Login - Screen:', 'Success login with username:', username);
      await login(username.trim(), password);
    } catch (error) {
      log.error('Login - Screen', error.message || error);
      Alert.alert('Login Error', error.message || error);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.select({ios: 'padding', android: undefined})}>
          <View style={styles.header}>
            <Image source={appLogo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.appName}>{APP_NAME}</Text>
            <Text style={styles.appDesc}>{APP_DESC}</Text>
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#888"
              keyboardType="username-address"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
              editable={!loading}
              importantForAutofill="yes"
              autoComplete="username"
              textContentType="username"
              accessibilityLabel="Username input"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              importantForAutofill="yes"
              autoComplete="password"
              textContentType="password"
              accessibilityLabel="Password input"
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLoginPress}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Login button">
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {APP_COPYRIGHT}. {APP_DEVELOPER}
            </Text>
            <Text style={styles.versionText}>v{APP_VERSION}</Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}></Text>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
  },
  appDesc: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e293b',
  },
  form: {
    // backgroundColor: 'rgba(255, 255, 255, 0.85)',
    // borderRadius: 2,
    // padding: 24,
    // shadowColor: '#3b82f6',
    // shadowOffset: {width: 0, height: 6},
    // shadowOpacity: 0.2,
    // shadowRadius: 6,
    // elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#a5b4fc',
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  button: {
    backgroundColor: '#6366f1',
    height: 48,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    fontSize: 14,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    fontSize: 14,
  },
  versionText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#1e293b',
  },
});
