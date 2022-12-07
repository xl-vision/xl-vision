import {
  NoticationGlobalConfig,
  MethodNoticationContainerProps,
  info,
  warning,
  error,
  success,
  open,
  setGlobalConfig,
} from './methods';
import useNotication from './useNotication';

export * from './Notication';
export * from './NoticationContainer';
export * from './useNotication';

export type { NoticationGlobalConfig, MethodNoticationContainerProps };

const Notication = {
  useNotication,
  info,
  warning,
  error,
  success,
  open,
  setGlobalConfig,
};

export default Notication;
