import { createContext } from 'react';
import { NoticationPlacement } from './NoticationContainer';

export default createContext<{ placement: NoticationPlacement }>({ placement: 'top-right' });
