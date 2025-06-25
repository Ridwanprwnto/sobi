import {API_BASE_URL} from 'react-native-dotenv';

/**
 * authService.js
 * Handles authentication API calls like login, logout.
 */

const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

const getUserProfile = async token => {
  try {
    const response = await fetch(`${API_BASE_URL}/validation`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching user profile:', errorData);
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('User profile data:', data);

    return data;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  return Promise.resolve();
};

export const authService = {
  login,
  getUserProfile,
  logout,
};
