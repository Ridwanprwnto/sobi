// logger.js
import {logger} from 'react-native-logs';
import RNFS from 'react-native-fs';
import axios from 'axios';
import {Platform} from 'react-native';

const logFilePath = `${RNFS.DocumentDirectoryPath}/app.log`;

// Transport untuk menyimpan log ke file
const fileTransport = async props => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${props.level.text.toUpperCase()}] ${
    props.msg
  }\n`;
  await RNFS.appendFile(logFilePath, logEntry, 'utf8');
};

// Transport untuk tampilkan log ke console (untuk dev)
const consoleTransport = props => {
  const output = `[${props.level.text.toUpperCase()}] ${props.msg}`;
  console[props.level.text === 'error' ? 'error' : 'log'](output);
};

// Gabungkan kedua transport
const combinedTransport = props => {
  if (__DEV__) {
    consoleTransport(props); // tampilkan ke console hanya saat dev
  }
  fileTransport(props); // selalu simpan ke file
};

// Buat logger
const log = logger.createLogger({
  severity: __DEV__ ? 'debug' : 'warn',
  transport: combinedTransport,
  transportOptions: {},
});

// Fungsi tambahan untuk baca & hapus log
const getLogs = async () => {
  try {
    const exists = await RNFS.exists(logFilePath);
    if (!exists) return '';
    return await RNFS.readFile(logFilePath, 'utf8');
  } catch (error) {
    return 'Failed to read logs.';
  }
};

const clearLogs = async () => {
  try {
    const exists = await RNFS.exists(logFilePath);
    if (exists) await RNFS.unlink(logFilePath);
  } catch (error) {
    // error saat hapus bisa diabaikan atau dilog juga
  }
};

const uploadLogFile = async () => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  try {
    const exists = await RNFS.exists(logFilePath);
    if (!exists) {
      log.warn('Log File - logger: No log file found to upload.');
      return;
    }

    const fileName = `app-log-${new Date().toISOString()}.log`;

    const formData = new FormData();
    formData.append('file', {
      uri: `file://${logFilePath}`,
      type: 'text/plain',
      name: fileName,
    });

    formData.append('platform', Platform.OS);
    formData.append('timestamp', new Date().toISOString());

    const response = await api.post('/upload-log', {formData});

    log.info(
      'Log Upload - logger: Log file uploaded successfully:',
      response.data,
    );
    return response.data;
  } catch (error) {
    log.error('Log Upload - logger: Failed to upload log file:', error);
    throw error;
  }
};

export {log, getLogs, clearLogs, uploadLogFile, logFilePath};
