// logger.js
import {logger} from 'react-native-logs';
import RNFS from 'react-native-fs';

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

const logFile = async () => {
  try {
    const exists = await RNFS.exists(logFilePath);
    if (!exists) {
      log.warn('Log File - logger: No log file found to upload.');
      return;
    }
    const filelog = `file://${logFilePath}`;
    return filelog;
  } catch (error) {
    log.error('Log Upload - logger: Failed to upload log file:', error);
    throw error;
  }
};

export {log, getLogs, clearLogs, logFile, logFilePath};
