import axios from 'axios';
import {API_BASE_URL} from 'react-native-dotenv';
import {log} from '../utils/logger';

/**
 * opnameService.js
 * Handles authentication API calls process opname.
 */

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const dataConditionService = async token => {
  try {
    const response = await api.get('/kondisi', {
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
