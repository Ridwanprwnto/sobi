import axios from 'axios';
import Config from 'react-native-config';
import {log} from '../utils/logger';

const API_URL = Config.API_BASE_URL + Config.API_PATH;
const SERVICE_PATH = '/master';

/**
 * opnameService.js
 * Handles authentication API calls process opname.
 */

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const dataConditionService = async token => {
  try {
    const response = await api.get(`${SERVICE_PATH}/kondisi`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    log.info(
      'Load Token - Condition Service: Success to load auth token',
      response.data.kondisi,
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    log.error('Load Token - Condition Service: ', error.message || error);
    throw message || error;
  }
};

export const conditionService = {
  dataConditionService,
};
