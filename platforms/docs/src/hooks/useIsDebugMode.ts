import { env } from '@xl-vision/utils';
import { useRouter } from 'next/router';

const useIsDebugMode = () => {
  const router = useRouter();

  return env.isDevelopment || 'debug' in router.query;
};

export default useIsDebugMode;
