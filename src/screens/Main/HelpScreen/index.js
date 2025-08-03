import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../../contexts/AuthContext';
import {useLoading} from '../../../utils/loading';
import LoadingMain from '../../../components/Loading';
import {log, logFile} from '../../../utils/logger';
import TextArea from '../../../components/TextArea';

export default function HelpScreen() {
  const {logout, withValidToken, refreshToken, handleSendLogFileContext} =
    useContext(AuthContext);
  const [messageLogs, setMessageLogs] = useState('');

  const {loading, withLoading} = useLoading();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await withLoading(async () => {
          try {
            setMessageLogs('');
            await refreshToken();
            log.info('Help Center - Screen:', 'Success get refresh token');
          } catch (error) {
            log.error('Help Center - Screen', error.message || error);
          }
        });
      };
      fetchData();
    }, []),
  );

  const handleSendLogPress = async () => {
    if (messageLogs.trim() === '') {
      Alert.alert('Info', 'Gagal mengirim log pesan masih kosong');
      return;
    }
    await withLoading(async () => {
      try {
        const logPath = await logFile();
        if (logPath) {
          await withValidToken(async () => {
            setMessageLogs('');
            await handleSendLogFileContext(messageLogs, logPath);
          });
        }
        log.info('Help Center - Screen:', 'Success send log to the server');
        Alert.alert('Info', ' Success send log to the server');
        return;
      } catch (error) {
        log.error('Help Center - Screen', error.message || error);
        Alert.alert('Send Log Error', error.message || error);
      }
    });
  };

  const handleLogout = () => {
    Alert.alert('Logout Confirmation', 'Apakah Anda yakin ingin keluar?', [
      {
        text: 'Batal',
        onPress: () => log.info('Logout dibatalkan'),
        style: 'cancel',
      },
      {
        text: 'Keluar',
        onPress: () => logout(),
      },
    ]);
  };

  if (loading) {
    return (
      <>
        <Appbar.Header>
          <Appbar.Content title="Help Center" />
          <Appbar.Action icon="logout" onPress={handleLogout} />
        </Appbar.Header>
        <LoadingMain text="Processing..." />
      </>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Help Center" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <View accessibilityRole="header">
          <View style={styles.header}>
            <Text style={styles.textHeader}>Send Messages and Log</Text>
          </View>
          <View style={styles.mainContent}>
            <TextArea
              placeholder="Enter message"
              value={messageLogs}
              onChangeText={setMessageLogs}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendLogPress}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Login button">
              <Text style={styles.buttonText}>Send to Server</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
