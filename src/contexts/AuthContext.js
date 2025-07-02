import React, {createContext, useState, useEffect} from 'react';
import storage from '../utils/storage';
import {authService} from '../services/authService';
import {opnameService} from '../services/opnameService';
import {conditionService} from '../services/conditionService';
import {log} from '../utils/logger';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  dataDraftOpname: [],
  dataItemsOpname: [],
  dataPersentaseOpname: [],
  dataCondition: [],
  loading: false,
  login: async () => {},
  logout: async () => {},
  checkAndRefreshToken: async () => {},
  dataDraftSOContext: async () => {},
  dataItemsSOContext: async () => {},
  dataPersentaseSOContext: async () => {},
  dataCheckItemSOContext: async () => {},
  saveItemSOContext: async () => {},
  dataConditionContext: async () => {},
});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataDraftOpname, setDataDraftOpname] = useState([]);
  const [dataItemsOpname, setDataItemsOpname] = useState([]);
  const [dataPersentaseOpname, setDataPersentaseOpname] = useState([]);
  const [dataCondition, setDataCondition] = useState([]);

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
      if (response.token) {
        log.info(
          'Refresh Token - Auth: ',
          response.user || 'Success to refresh auth token',
        );
        await storage.saveToken(response.token);
        return response.token;
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
        setUser(response.user);
      } else {
        log.error('Login - Auth: ', response.error || 'Invalid login response');
        throw new Error(response.error || 'Invalid login response');
      }
    } catch (error) {
      log.error('Login - Auth: ', error);
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

  // Function to check and refresh token before making API calls
  const checkAndRefreshToken = async () => {
    setLoading(true);
    try {
      const token = await storage.getToken();
      if (token) {
        const newToken = await refreshToken();
        return newToken || token;
      }
      return null;
    } catch (error) {
      log.error('Check & Refresh Token - Auth: ', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------

  // Function
  const dataDraftSOContext = async (office, department) => {
    setLoading(true);
    try {
      const response = await opnameService.dataDraftSOService(
        office,
        department,
      );
      if (response.success == true) {
        setDataDraftOpname(response.data);
        log.info('Get Draft Opname - Auth: ', response.data);
      } else {
        setDataDraftOpname([]);
        log.error('Get Draft Opname - Auth: ', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      setDataDraftOpname([]);
      log.error('Get Draft Opname - Auth: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function
  const dataItemsSOContext = async noref => {
    setLoading(true);
    try {
      const response = await opnameService.dataItemsSOService(noref);
      if (response.success == true) {
        setDataItemsOpname(response);
        log.info('Get Items Opname - Auth: ', response);
      } else {
        setDataItemsOpname([]);
        log.error('Get Items Opname - Auth: ', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      setDataItemsOpname([]);
      log.error('Get Items Opname - Auth: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function
  const dataPersentaseSOContext = async noref => {
    setLoading(true);
    try {
      const response = await opnameService.dataPersentaseSOService(noref);
      if (response.success == true) {
        setDataPersentaseOpname(response);
        log.info('Get Persentase Opname - Auth: ', response);
      } else {
        setDataPersentaseOpname([]);
        log.error('Get Persentase Opname - Auth: ', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      setDataPersentaseOpname([]);
      log.error('Get Persentase Opname - Auth: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function
  const dataCheckItemSOContext = async (noref, noid) => {
    setLoading(true);
    try {
      const response = await opnameService.dataCheckItemSOService(noref, noid);
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
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      const response = await opnameService.saveItemSOService(
        noref,
        nocode,
        noid,
        condition,
        location,
        user,
        photo,
      );
      if (response.success == true) {
        log.info('Save Item Opname - Auth: ', response.data);
        return response.data;
      } else {
        log.error('Save Item Opname - Auth: ', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      log.error('Save Item Opname - Auth: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------

  // Function
  const dataConditionContext = async () => {
    setLoading(true);
    try {
      const token = await storage.getToken();
      if (token) {
        const response = await conditionService.dataConditionService(token);
        setDataCondition(response.kondisi);
        log.info(
          'Get Condition - Auth: ',
          'Success to load auth token',
          response,
        );
      }
    } catch (error) {
      setDataCondition([]);
      log.error('Get Condition - Auth: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------

  // Function
  const handleSendLogFile = async () => {
    setLoading(true);
    try {
      const response = await uploadLogFile();
      log.info(
        'Send Log - Auth: ',
        'Success send log to the server',
        response.message,
      );
    } catch (error) {
      log.error('Send Log - Auth: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        dataDraftOpname,
        dataItemsOpname,
        dataPersentaseOpname,
        dataCondition,
        loading,
        login,
        logout,
        checkAndRefreshToken,
        dataDraftSOContext,
        dataItemsSOContext,
        dataPersentaseSOContext,
        dataCheckItemSOContext,
        dataConditionContext,
        saveItemSOContext,
        handleSendLogFile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
