import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Card} from 'react-native-paper';

import {AuthContext} from '../../../contexts/AuthContext';

export default function LoginScreen() {
  const {login, loading} = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginPress = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Username and Password are required.');
      return;
    }
    try {
      await login(username.trim(), password);
    } catch (error) {
      Alert.alert('Error :', 'daadad');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ios: 'padding', android: undefined})}>
      <Card>
        <Card.Cover source={{uri: 'https://picsum.photos/700'}} />
      </Card>
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>
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
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e7ff', // subtle light purple background
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#3b82f6',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#a5b4fc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  button: {
    backgroundColor: '#6366f1',
    height: 48,
    borderRadius: 12,
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
});
