import { useContext } from 'react';
import ConfigContext from './ConfigContext';

const useConfig = () => {
  return useContext(ConfigContext);
};

export default useConfig;
