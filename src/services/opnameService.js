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

const dataDraftSOService = async (office, department) => {
  try {
    const response = await api.post('/draftso', {office, department});
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

const dataItemsSOService = async noref => {
  try {
    const response = await api.post('/itemso', {noref});
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

const dataPersentaseSOService = async noref => {
  try {
    const response = await api.post('/persentaseso', {noref});
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

const dataCheckItemSOService = async (noref, noid) => {
  try {
    const response = await api.post('/updateso', {noref, noid});
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
) => {
  try {
    const response = await api.post('/saveso', {
      noref,
      nocode,
      noid,
      condition,
      location,
      user,
      photo,
    });
    log.info('Save Item Opname - Service: ', response.data.data);
    return response.data;
  } catch (error) {
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
