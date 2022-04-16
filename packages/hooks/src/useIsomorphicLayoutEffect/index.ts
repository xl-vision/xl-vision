import { useEffect, useLayoutEffect } from 'react';
import { isBrowser } from '@xl-vision/utils';

// 修复在ssr中的警告
export default isBrowser ? useLayoutEffect : useEffect;
