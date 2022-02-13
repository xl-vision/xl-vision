import React from 'react';
import ConfigContext from './ConfigContext';

const useConfig = () => {
  return React.useContext(ConfigContext);
};

export default useConfig;
