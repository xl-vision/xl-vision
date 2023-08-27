import { isDevelopment } from '@xl-vision/utils';
import { useSearchParams } from 'next/navigation';

const useIsDebugMode = () => {
  const params = useSearchParams();

  return isDevelopment || params.has('debug');
};

export default useIsDebugMode;
