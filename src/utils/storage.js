import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

/**
 * storage.js
 * AsyncStorage helpers for token persistence and retrieval.
 */

const saveToken = async token => {
  try {
    await AsyncStorage.setItem(Config.TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token to storage', error);
  }
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem(Config.TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token from storage', error);
    return null;
  }
};

const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(Config.TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token from storage', error);
  }
};

const setTokenExpiration = async exp => {
  await AsyncStorage.setItem('token_exp', exp.toString());
};

const getTokenExpiration = async () => {
  const exp = await AsyncStorage.getItem('token_exp');
  return exp ? parseInt(exp, 10) : null;
};

export default {
  saveToken,
  getToken,
  clearToken,
  setTokenExpiration,
  getTokenExpiration,
};
