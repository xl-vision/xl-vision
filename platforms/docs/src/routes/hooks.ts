import { RouteType } from './types';

const hookRoutes: Array<RouteType> = [
  {
    titleMap: {
      'en-US': 'Overview',
      'zh-CN': '总览',
    },
    name: 'Overview',
    docs: () => import('@docs/docs/hooks/Overview/index.en-US.mdx?locale'),
  },
  {
    titleMap: {
      'en-US': 'useTransition',
      'zh-CN': 'useTransition',
    },
    name: 'useTransition',
    docs: () => import('@xl-vision/hooks/src/useTransition/__doc__/index.en-US.mdx?locale'),
  },
  {
    titleMap: {
      'en-US': 'useCssTransition',
      'zh-CN': 'useCssTransition',
    },
    name: 'useCssTransition',
    docs: () => import('@xl-vision/hooks/src/useCssTransition/__doc__/index.en-US.mdx?locale'),
  },
  {
    titleMap: {
      'en-US': 'usePopper',
      'zh-CN': 'usePopper',
    },
    name: 'usePopper',
    docs: () => import('@xl-vision/usePopper/src/__doc__/index.en-US.mdx?locale'),
  },
  {
    titleMap: {
      'en-US': 'useNotication',
      'zh-CN': 'useNotication',
    },
    name: 'useNotication',
    docs: () => import('@xl-vision/hooks/src/useNotication/__doc__/index.en-US.mdx?locale'),
  },
  {
    titleMap: {
      'en-US': 'useForm',
      'zh-CN': 'useForm',
    },
    name: 'useForm',
    docs: () => import('@xl-vision/useForm/src/__doc__/index.en-US.mdx?locale'),
  },
  {
    titleMap: {
      'en-US': 'useResizeObserver',
      'zh-CN': 'useResizeObserver',
    },
    name: 'useResizeObserver',
    docs: () => import('@xl-vision/hooks/src/useResizeObserver/__doc__/index.en-US.mdx?locale'),
  },
];

export default hookRoutes;
