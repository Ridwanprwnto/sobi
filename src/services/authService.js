import axios from 'axios';
import Config from 'react-native-config';
import {log} from '../utils/logger';

const API_URL = Config.API_BASE_URL + Config.API_PATH;
const AUTH_PATH = Config.AUTH_PATH;
const MAIN_PATH = Config.MAIN_PATH;

/**
 * authService.js
 * Handles authentication API calls like login, logout.
 */

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

const login = async (username, password) => {
  try {
    const response = await api.post(`${AUTH_PATH}/users/login`, {
      username,
      password,
    });
    log.info('Login - Service: ', response.data.user);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    log.error('Login - Service: Failed connect to server', message || error);
    throw message || error;
  }
};

const getUser = async token => {
  try {
    const response = await api.get(`${MAIN_PATH}/token/refresh`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    log.info(
      'Load Token - Service: Success to load auth token',
      response.data.user,
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    log.error('Load Token - Service: ', error.message || error);
    throw message || error;
  }
};

const logout = async () => {
  return Promise.resolve();
};

export const authService = {
  login,
  getUser,
  logout,
};
