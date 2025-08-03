import axios from 'axios';
import Config from 'react-native-config';
import {Platform} from 'react-native';
import {log} from '../utils/logger';

const API_URL = Config.API_BASE_URL + Config.API_PATH;
const SERVICE_PATH = '/help';

/**
 * authService.js
 * Handles authentication API calls like login, logout.
 */

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {},
});

const sendLogFileService = async (message, logfile) => {
  try {
    const formData = new FormData();
    const fileName = `app-log-${new Date().toISOString()}.log`;

    formData.append('file', {
      uri: logfile,
      type: 'text/plain',
      name: fileName,
    });

    formData.append('platform', Platform.OS);
    formData.append('timestamp', new Date().toISOString());
    formData.append('message', message);

    const response = await api.post(`${SERVICE_PATH}/upload-log`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    log.info('Send Log File - Service: ', response.data);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error.message || 'Unknown error';
    log.error('Send Log File - Service: Failed connect to server', message);
    throw message;
  }
};

export const helpService = {
  sendLogFileService,
};
