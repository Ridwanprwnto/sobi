import React, {createContext, useState, useEffect} from 'react';
import storage from '../utils/storage';
import {authService} from '../services/authService';
import {opnameService} from '../services/opnameService';
import {conditionService} from '../services/conditionService';
import {helpService} from '../services/helpService';
import {log} from '../utils/logger';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
  loadingContext: async () => {},
  refreshToken: async () => {},
  dataDraftSOContext: async () => {},
  dataItemsSOContext: async () => {},
  dataPersentaseSOContext: async () => {},
  dataCheckItemSOContext: async () => {},
  saveItemSOContext: async () => {},
  dataConditionContext: async () => {},
  handleSendLogFileContext: async () => {},
});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token and restore user on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await storage.getToken();
        if (token) {
          const response = await authService.getUser(token);
          setUser(response.user);
          log.info(
            'Load Token - Auth: ',
            'Success to load auth token',
            response.user,
          );
        }
      } catch (error) {
        log.error('Load Token - Auth:', error || 'Failed to load auth token');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Function to refresh token
  const refreshToken = async () => {
    try {
      const token = await storage.getToken();
      const response = await authService.getUser(token);

      if (response?.success) {
        const newToken = response.token;

        if (newToken) {
          log.info(
            'Refresh Token - Auth: ',
            response.user?.username || 'Success to refresh auth token',
          );

          await storage.saveToken(newToken);

          const payloadBase64 = newToken.split('.')[1];
          const decoded = JSON.parse(atob(payloadBase64));

          await storage.setTokenExpiration(decoded.exp);

          setUser(response.user);

          return newToken;
        } else {
          log.info(
            'Refresh Token - Auth: Token masih valid, tidak ada token baru',
          );
          return token;
        }
      } else {
        log.warn('Refresh Token - Token tidak valid di server');
        await logout();
      }
    } catch (error) {
      log.error('Refresh Token - Auth: ', error);
      await logout();
    }
    return null;
  };

  // Login function calls API, stores token, sets user
  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await authService.login(username, password);
      if (response.token) {
        log.info('Login - Auth: ', response.user || 'Success to login');
        await storage.saveToken(response.token);

        const payloadBase64 = response.token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        await storage.setTokenExpiration(decoded.exp);

        setUser(response.user);
      } else {
        log.error('Login - Auth: ', response.error || 'Invalid login response');
        throw new Error(response.error || 'Invalid login response');
      }
    } catch (error) {
      log.error('Login - Auth: Failed connect to server', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout clears stored token and user state
  const logout = async () => {
    setLoading(true);
    try {
      log.info('Logout - Auth: ', 'Success logout account', user);
      await authService.logout();
    } catch (error) {
      log.error('Logout - Auth:', error || 'Logout failed', user);
    }
    await storage.clearToken();
    setUser(null);
    setLoading(false);
  };

  const withValidToken = async fn => {
    await refreshToken();
    return await fn();
  };

  const loadingContext = bool => {
    if (typeof bool !== 'boolean') {
      console.error('Expected a boolean value for loadingContext');
      return;
    }
    setLoading(bool);
  };

  // -------------------------------------------------------------------

  // Function
  const dataDraftSOContext = async (office, department) => {
    try {
      const token = await storage.getToken();
      const response = await opnameService.dataDraftSOService(
        office,
        department,
        token,
      );
      if (response.success == true) {
        log.info('Get Draft Opname - Auth: ', response.data);
        return response.data;
      } else {
        log.error('Get Draft Opname - Auth: ', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      log.error('Get Draft Opname - Auth: ', error);
      throw error;
    }
  };

  // Function
  const dataItemsSOContext = async noref => {
    try {
      const token = await storage.getToken();
      const response = await opnameService.dataItemsSOService(noref, token);
      if (response.success == true) {
        log.info('Get Items Opname - Auth: ', response);
        return response;
      } else {
        log.error('Get Items Opname - Auth: ', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      log.error('Get Items Opname - Auth: ', error);
      throw error;
    }
  };

  // Function
  const dataPersentaseSOContext = async noref => {
    try {
      const token = await storage.getToken();
      const response = await opnameService.dataPersentaseSOService(
        noref,
        token,
      );
      if (response.success == true) {
        log.info('Get Persentase Opname - Auth: ', response);
        return response;
      } else {
        log.error('Get Persentase Opname - Auth: ', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      log.error('Get Persentase Opname - Auth: ', error);
      throw error;
    }
  };

  // Function
  const dataCheckItemSOContext = async (noref, noid) => {
    try {
      const token = await storage.getToken();
      const response = await opnameService.dataCheckItemSOService(
        noref,
        noid,
        token,
      );
      if (response.success == true) {
        log.info('Check Item Opname - Auth: ', response.data);
        return response.data;
      } else if (response.success == false) {
        log.error('Check Item Opname - Auth: ', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      log.error('Check Item Opname - Auth: ', error);
      throw error;
    }
  };

  // Function
  const saveItemSOContext = async (
    noref,
    nocode,
    noid,
    condition,
    location,
    user,
    photo,
  ) => {
    try {
      const token = await storage.getToken();
      const response = await opnameService.saveItemSOService(
        noref,
        nocode,
        noid,
        condition,
        location,
        user,
        photo,
        token,
      );
      if (response.success == true) {
        log.info('Save Item Opname - Auth: ', response);
        return response;
      } else {
        log.error('Save Item Opname - Auth: ', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      log.error('Save Item Opname - Auth: ', error);
      throw error;
    }
  };

  // -------------------------------------------------------------------

  // Function
  const dataConditionContext = async () => {
    try {
      const token = await storage.getToken();
      if (token) {
        const response = await conditionService.dataConditionService(token);
        log.info(
          'Get Condition - Auth: ',
          'Success to load auth token',
          response,
        );
        return response.kondisi;
      }
    } catch (error) {
      log.error('Get Condition - Auth: ', error);
      throw error;
    }
  };

  // -------------------------------------------------------------------

  // Function
  const handleSendLogFileContext = async (message, logfile) => {
    try {
      const token = await storage.getToken();
      const response = await helpService.sendLogFileService(
        message,
        logfile,
        token,
      );
      if (response.success == true) {
        log.info('Send Log File - Auth: ', response.data);
        return response.data;
      } else {
        log.error('Send Log File - Auth: ', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      log.error('Send Log File - Auth: ', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        logout,
        loadingContext,
        withValidToken,
        refreshToken,
        dataDraftSOContext,
        dataItemsSOContext,
        dataPersentaseSOContext,
        dataCheckItemSOContext,
        dataConditionContext,
        saveItemSOContext,
        handleSendLogFileContext,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
