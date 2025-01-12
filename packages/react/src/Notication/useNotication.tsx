import {
  NoticationHookReturnType as InnerNoticationHookReturnType,
  NoticationHookProps,
  NoticationOptions,
  useNotication as useInnerNotication,
} from '@xl-vision/hooks';
import { useCallback, useMemo, useState } from 'react';
import Notication, { NoticationProps, NoticationType } from './Notication';
import NoticationList, { NoticationContainerProps } from './NoticationContainer';
import { increaseZindex } from '../utils/zIndexManger';

export type NoticationHookOptions = NoticationOptions<Omit<NoticationContainerProps, 'zIndex'>>;

export type NoticationHookReturnType = InnerNoticationHookReturnType<NoticationProps>;

const useNotication = (options: Partial<NoticationHookOptions> = {}) => {
  const [zIndex, setZIndex] = useState<number>();

  const [instance, holder] = useInnerNotication(Notication, NoticationList, {
    ...options,
    zIndex,
  });

  const method = useCallback(
    (
      props: NoticationHookProps<NoticationProps> | string,
      type?: NoticationType,
    ): NoticationHookReturnType => {
      setZIndex(() => increaseZindex());

      const parsedProps: NoticationHookProps<NoticationProps> =
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
      open: (props: NoticationHookProps<NoticationProps>) => method(props),
      error: (props: Omit<NoticationHookProps<NoticationProps>, 'type'> | string) =>
        method(props, 'error'),
      info: (props: Omit<NoticationHookProps<NoticationProps>, 'type'> | string) =>
        method(props, 'info'),
      success: (props: Omit<NoticationHookProps<NoticationProps>, 'type'> | string) =>
        method(props, 'success'),
      warning: (props: Omit<NoticationHookProps<NoticationProps>, 'type'> | string) =>
        method(props, 'warning'),
      destroyAll: () => {
        instance.destroyAll();
      },
    }),
    [instance, method],
  );

  return [methods, holder] as const;
};

export default useNotication;
