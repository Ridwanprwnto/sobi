import {useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext';

export const useLoading = () => {
  const {loading, loadingContext} = useContext(AuthContext);

  const withLoading = async callback => {
    try {
      loadingContext(true);
      return await callback();
    } catch (error) {
      throw error;
    } finally {
      loadingContext(false);
    }
  };

  return {loading, withLoading};
};
