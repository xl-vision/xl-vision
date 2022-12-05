import {
  NoticationHookReturnType as InnerNoticationHookReturnType,
  NoticationOptions,
  useNotication as useInnerNotication,
} from '@xl-vision/hooks';
import { useCallback, useMemo, useState } from 'react';
import { increaseZindex } from '../utils/zIndexManger';
import Notication, { NoticationProps, NoticationType } from './Notication';
import NoticationList, { NoticationContainerProps } from './NoticationContainer';

export type NoticationHookOptions = NoticationOptions<Omit<NoticationContainerProps, 'zIndex'>>;

export type NoticationHookReturnType = InnerNoticationHookReturnType<NoticationProps>;

const useNotication = (options: Partial<NoticationHookOptions> = {}) => {
  const [zIndex, setZIndex] = useState<number>();

  const [instance, holder] = useInnerNotication(Notication, NoticationList, {
    ...options,
    zIndex,
  });

  const method = useCallback(
    (props: NoticationProps | string, type?: NoticationType): NoticationHookReturnType => {
      setZIndex(() => increaseZindex());

      const parsedProps: NoticationProps =
        typeof props === 'string' ? { message: props } : { ...props };

      if (type) {
        parsedProps.type = type;
      }
      return instance.open(parsedProps);
    },
    [instance],
  );

  const methods = useMemo(
    () => ({
      open: (props: NoticationProps) => method(props),
      loading: (props: Omit<NoticationProps, 'type'> | string) => method(props, 'loading'),
      error: (props: Omit<NoticationProps, 'type'> | string) => method(props, 'error'),
      info: (props: Omit<NoticationProps, 'type'> | string) => method(props, 'info'),
      success: (props: Omit<NoticationProps, 'type'> | string) => method(props, 'success'),
      warning: (props: Omit<NoticationProps, 'type'> | string) => method(props, 'warning'),
      destroyAll: () => {
        instance.destroyAll();
      },
    }),
    [instance, method],
  );

  return [methods, holder] as const;
};

export default useNotication;
