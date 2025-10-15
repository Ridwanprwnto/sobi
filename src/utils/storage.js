import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

/**
 * storage.js
 * AsyncStorage helpers for token persistence and retrieval.
 */

const KEYS = {
  TOKEN: Config.TOKEN_KEY || 'auth_token',
  EXP: 'token_exp',
};

/**
 * Menyimpan token ke storage
 */
const saveToken = async token => {
  try {
    await AsyncStorage.setItem(KEYS.TOKEN, token);
  } catch (error) {
    console.error('Failed to save token to storage', error);
  }
};

/**
 * Mengambil token dari storage
 */
const getToken = async () => {
  try {
    return await AsyncStorage.getItem(KEYS.TOKEN);
  } catch (error) {
    console.error('Failed to get token from storage', error);
    return null;
  }
};

/**
 * Menghapus token dari storage
 */
const clearToken = async () => {
  try {
    await AsyncStorage.multiRemove([KEYS.TOKEN, KEYS.EXP]);
  } catch (error) {
    console.error('Failed to remove token from storage', error);
  }
};

/**
 * Menyimpan waktu kedaluwarsa token (exp)
 */
const setTokenExpiration = async exp => {
  try {
    await AsyncStorage.setItem(KEYS.EXP, exp.toString());
  } catch (error) {
    console.error('Failed to save token expiration:', error);
  }
};

/**
 * Mengambil waktu kedaluwarsa token
 */
const getTokenExpiration = async () => {
  try {
    const exp = await AsyncStorage.getItem(KEYS.EXP);
    return exp ? parseInt(exp, 10) : null;
  } catch (error) {
    console.error('Failed to get token expiration:', error);
    return null;
  }
};

const isTokenExpired = async () => {
  const exp = await AsyncStorage.getItem('token_exp');
  if (!exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return now >= parseInt(exp, 10);
};

export default {
  saveToken,
  getToken,
  clearToken,
  setTokenExpiration,
  getTokenExpiration,
  isTokenExpired,
};
