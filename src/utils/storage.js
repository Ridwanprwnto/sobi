import AsyncStorage from '@react-native-async-storage/async-storage';
import {TOKEN_KEY} from 'react-native-dotenv';

/**
 * storage.js
 * AsyncStorage helpers for token persistence and retrieval.
 */

const saveToken = async token => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token to storage', error);
  }
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token from storage', error);
    return null;
  }
};

const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token from storage', error);
  }
};

export default {
  saveToken,
  getToken,
  clearToken,
};
