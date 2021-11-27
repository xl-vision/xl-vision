import React from 'react';
import LocalizationContext from './LocalizationContext';

const useLocale = () => {
  return React.useContext(LocalizationContext);
};

export default useLocale;
