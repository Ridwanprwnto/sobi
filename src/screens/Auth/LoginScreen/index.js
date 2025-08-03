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
import {Text, TextInput} from 'react-native-paper';
import Config from 'react-native-config';
import {log} from '../../../utils/logger';
import appLogo from '../../../assets/images/app-icon.png';
import LoadingMain from '../../../components/Loading';

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
      await login(username.trim(), password);
      log.info('Login - Screen:', 'Success login with username:', username);
    } catch (error) {
      log.error('Login - Screen', error.message || error);
      Alert.alert('Login Error', error.message || error);
    }
  };

  if (loading) {
    return (
      <>
        <LoadingMain text="" />
      </>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.select({ios: 'padding', android: undefined})}>
          <View style={styles.header}>
            <Image source={appLogo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.appName}>{Config.APP_NAME}</Text>
            <Text style={styles.appDesc}>{Config.API_BASE_URL}</Text>
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
              {Config.APP_COPYRIGHT}. {Config.APP_DEVELOPER}
            </Text>
            <Text style={styles.versionText}>v{Config.APP_VERSION}</Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 8,
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
    marginTop: 14,
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
});
