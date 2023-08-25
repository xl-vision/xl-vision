import { isDevelopment } from '@xl-vision/utils';
import { useRouter } from 'next/router';

const useIsDebugMode = () => {
  const router = useRouter();

  return isDevelopment || 'debug' in router.query;
};

export default useIsDebugMode;
