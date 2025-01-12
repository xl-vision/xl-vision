import { info, warning, error, success, open, destroyAll, setGlobalConfig } from './methods';
import useNotication from './useNotication';

export { type NoticationGlobalConfig, type MethodNoticationContainerProps } from './methods';
export * from './Notication';
export * from './NoticationContainer';
export * from './useNotication';

const Notication = {
  destroyAll,
  useNotication,
  info,
  warning,
  error,
  success,
  open,
  setGlobalConfig,
};

export default Notication;
