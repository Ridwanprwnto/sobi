import axios from 'axios';
import Config from 'react-native-config';
import {log} from '../utils/logger';

const API_URL = Config.API_BASE_URL + Config.API_PATH;
const MAIN_PATH = Config.MAIN_PATH;

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

const dataDraftSOService = async (office, department, token) => {
  try {
    const response = await api.post(
      `${MAIN_PATH}/records/drafts`,
      {
        office,
        department,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    log.info('Get Draft Opname - Service: ', response.data.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    log.error('Get Draft Opname - Service: ', message || error);
    throw message || error;
  }
};

const dataItemsSOService = async (noref, token) => {
  try {
    const response = await api.post(
      `${MAIN_PATH}/records/items`,
      {
        noref,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    log.info('Get Items Opname - Service: ', response.data.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    log.error('Get Items Opname - Service: ', message || error);
    throw message || error;
  }
};

const dataPersentaseSOService = async (noref, token) => {
  try {
    const response = await api.post(
      `${MAIN_PATH}/records/progress`,
      {
        noref,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    log.info('Get Persentase Opname - Service: ', response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    log.error('Get Persentase Opname - Service: ', message || error);
    throw message || error;
  }
};

const dataCheckItemSOService = async (noref, noid, token) => {
  try {
    const response = await api.post(
      `${MAIN_PATH}/records/process`,
      {
        noref,
        noid,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    log.info('Check Item Opname - Service: ', response.data.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    log.error('Check Item Opname - Service: ', message || error);
    throw message || error;
  }
};

const saveItemSOService = async (
  noref,
  nocode,
  noid,
  condition,
  location,
  user,
  photo,
  token,
) => {
  try {
    const response = await api.put(
      `${MAIN_PATH}/records/process/${noref}`,
      {
        nocode,
        noid,
        condition,
        location,
        user,
        photo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    log.info('Save Item Opname - Service: ', response.data);
    return response.data;
  } catch (error) {
    let message = '';
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    log.error('Save Item Opname - Service: ', message || error);
    throw message || error;
  }
};

export const opnameService = {
  dataDraftSOService,
  dataItemsSOService,
  dataPersentaseSOService,
  dataCheckItemSOService,
  saveItemSOService,
};
