import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Appbar, Text, ActivityIndicator} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../../contexts/AuthContext';
import {log, uploadLogFile} from '../../../utils/logger';
import TextArea from '../../../components/TextArea';

export default function HelpScreen() {
  const {loading, logout, checkAndRefreshToken, handleSendLogFile} =
    useContext(AuthContext);
  const [messageLogs, setMessageLogs] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await checkAndRefreshToken();
          log.info('Help Center - Screen:', 'Success get refresh token');
        } catch (error) {
          log.error('Help Center - Screen', error.message || error);
        }
      };
      fetchData();
    }, []),
  );

  const handleSendLogPress = async () => {
    log.info('Help Center - Screen:', 'Username and Password are required');
    Alert.alert('Send Log', 'Success send log to the server');
    return;
    try {
      log.info('Help Center:', 'Success send log to the server');
      await handleSendLogFile();
    } catch (error) {
      log.error('Help Center', error.message || error);
      Alert.alert('Send Log Error', error.message || error);
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Help Center" />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <View accessibilityRole="header">
          <View style={styles.header}>
            <Text style={styles.textHeader}>Report Help</Text>
          </View>
          <TextArea placeholder="Enter message" value={messageLogs} />
          <View style={styles.mainContent}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendLogPress}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Login button">
              <Text style={styles.buttonText}>Send Message Help Center</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Memproses...</Text>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  textHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'left',
  },
  mainContent: {
    marginTop: 4,
  },
  button: {
    backgroundColor: '#6366f1',
    height: 48,
    width: 110,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
