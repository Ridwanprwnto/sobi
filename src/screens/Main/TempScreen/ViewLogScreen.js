import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Appbar, Card, Text, Divider} from 'react-native-paper';
import {AuthContext} from '../../../contexts/AuthContext';
import {getLogs, clearLogs} from '../../../utils/logger';

export default function HelpScreen() {
  const {logout} = useContext(AuthContext);
  const [logContent, setLogContent] = useState('');
  const [logsLoaded, setLogsLoaded] = useState(false);

  const loadLogs = async () => {
    const logs = await getLogs();
    setLogContent(logs);
    setLogsLoaded(true);
  };

  const handleClearLogs = async () => {
    await clearLogs();
    setLogContent('');
    setLogsLoaded(false);
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
            <Text style={styles.textHeader}>Logs</Text>
          </View>

          <View style={styles.mainContent}>
            <Card style={styles.card}>
              <Card.Title titleStyle={styles.logTitle} title="Log Output" />
              <Divider />
              <Card.Content>
                {logsLoaded ? (
                  <ScrollView style={styles.logScroll} nestedScrollEnabled>
                    <Text style={styles.logText}>
                      {logContent || 'No logs available.'}
                    </Text>
                  </ScrollView>
                ) : (
                  <Text style={styles.logText}>
                    Klik "Load Logs" untuk menampilkan log.
                  </Text>
                )}
              </Card.Content>
            </Card>
            {/* Tombol pindah ke luar card */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.buttonOutline} onPress={loadLogs}>
                <Text style={styles.buttonTextOutline}>Load Logs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDanger}
                onPress={handleClearLogs}>
                <Text style={styles.buttonText}>Clear Logs</Text>
              </TouchableOpacity>
            </View>
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
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 2,
    elevation: 2,
    paddingBottom: 12,
  },
  logScroll: {
    maxHeight: Dimensions.get('window').height * 0.4,
  },
  logTitle: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  logText: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 16,
  },
  buttonRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginTop: 14,
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 2,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonOutline: {
    borderWidth: 1,
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 2,
    marginLeft: 5,
  },
  buttonTextOutline: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
