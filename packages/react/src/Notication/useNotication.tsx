import {
  NoticationHookReturnType as InnerNoticationHookReturnType,
  NoticationHookProps,
  NoticationOptions,
  useNotication as useInnerNotication,
} from '@xl-vision/hooks';
import { useCallback, useMemo, useState } from 'react';
import NoticationWrapper, { NoticationWrapperProps, NoticationType } from './Notication';
import NoticationList, { NoticationContainerProps } from './NoticationContainer';
import { increaseZindex } from '../utils/zIndexManger';

export type NoticationHookOptions = NoticationOptions<Omit<NoticationContainerProps, 'zIndex'>>;

export type NoticationHookReturnType = InnerNoticationHookReturnType<NoticationWrapperProps>;

const useNotication = (options: Partial<NoticationHookOptions> = {}) => {
  const [zIndex, setZIndex] = useState<number>();

  const [instance, holder] = useInnerNotication(NoticationWrapper, NoticationList, {
    ...options,
    zIndex,
  });

  const method = useCallback(
    (
      props: NoticationHookProps<NoticationWrapperProps> | string,
      type?: NoticationType,
    ): NoticationHookReturnType => {
      setZIndex(() => increaseZindex());

      const parsedProps: NoticationHookProps<NoticationWrapperProps> =
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
      open: (props: NoticationHookProps<NoticationWrapperProps>) => method(props),
      error: (props: Omit<NoticationHookProps<NoticationWrapperProps>, 'type'> | string) =>
        method(props, 'error'),
      info: (props: Omit<NoticationHookProps<NoticationWrapperProps>, 'type'> | string) =>
        method(props, 'info'),
      success: (props: Omit<NoticationHookProps<NoticationWrapperProps>, 'type'> | string) =>
        method(props, 'success'),
      warning: (props: Omit<NoticationHookProps<NoticationWrapperProps>, 'type'> | string) =>
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
