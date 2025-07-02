import React, {useState} from 'react';
import {View, Button, Alert, ActivityIndicator} from 'react-native';
import {uploadLogFile} from '../../../utils/logger';

export default function SendLogFileScreen() {
  const [loading, setLoading] = useState(false);

  const handleSendLogFile = async () => {
    setLoading(true);
    try {
      const response = await uploadLogFile();
      Alert.alert('Sukses', 'Log file berhasil dikirim!');
    } catch (error) {
      Alert.alert('Gagal', 'Gagal mengirim log file. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{padding: 16}}>
      <Button title="Kirim Log File ke Server" onPress={handleSendLogFile} />
      {loading && <ActivityIndicator style={{marginTop: 10}} />}
    </View>
  );
}
