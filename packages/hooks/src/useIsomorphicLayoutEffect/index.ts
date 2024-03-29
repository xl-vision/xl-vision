import { isBrowser } from '@xl-vision/utils';
import { useEffect, useLayoutEffect } from 'react';

// 修复在ssr中的警告
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
