import {
  NoticationContainerProps,
  NoticationContainerType,
  NoticationHookProps,
  NoticationHookReturnType,
  NoticationOptions,
  NoticationProps,
  useNotication,
} from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import { ComponentType, createRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';

type MethodNoticationRef<P extends NoticationProps, NCP extends NoticationContainerProps> = {
  instance: ReturnType<typeof useNotication<P, NCP>>[0];
  sync: () => void;
};

const createNotication = <P extends NoticationProps, NCP extends NoticationContainerProps>(
  Notication: ComponentType<P>,
  NoticationContainer: NoticationContainerType<NCP>,
  defaultGlobalConfig: NoticationOptions<NCP>,
) => {
  const globalConfigRef = {
    value: {
      ...defaultGlobalConfig,
    },
  };

  const MethodRefNotication = forwardRef<MethodNoticationRef<P, NCP>>((_, ref) => {
    const [noticationListState, setNoticationListState] = useState(globalConfigRef.value);

    const [methods, holder] = useNotication(Notication, NoticationContainer, noticationListState);

    useImperativeHandle(ref, () => {
      return {
        instance: methods,
        sync() {
          setNoticationListState(globalConfigRef.value);
        },
      };
    });

    return holder;
  });

  if (!isProduction) {
    MethodRefNotication.displayName = 'MethodRefNotication';
  }

  const noticationRef = createRef<MethodNoticationRef<P, NCP>>();

  let rootEl: HTMLElement | undefined;
  let root: Root | undefined;
  let count = 0;

  const destroyDOM = () => {
    if (root) {
      root.unmount();
      root = undefined;
    }
    if (rootEl) {
      if (rootEl.parentNode) {
        rootEl.parentNode.removeChild(rootEl);
      }
      rootEl = undefined;
    }
  };

  const open = (props: NoticationHookProps<P>): NoticationHookReturnType<P> => {
    const currentProps = {
      ...props,
    };

    let hookMethods: NoticationHookReturnType<P> | undefined;

    let promise = Promise.resolve();

    if (!rootEl) {
      const div = document.createElement('div');
      document.body.appendChild(div);
      rootEl = div;

      root = createRoot(div);

      promise = promise.then(() => root?.render(<MethodRefNotication ref={noticationRef} />));
    }

    count++;

    const resultPromise = promise.then(() => {
      hookMethods = noticationRef.current?.instance.open({
        ...currentProps,
        onAfterClosed() {
          count--;
          if (count <= 0) {
            destroyDOM();
          }
          currentProps.onAfterClosed?.();
        },
      });
      return hookMethods;
    }) as NoticationHookReturnType<P>;

    resultPromise.update = (updateProps) => hookMethods?.update(updateProps);
    resultPromise.destroy = () => hookMethods?.destroy();
    resultPromise.isDestroyed = () => hookMethods?.isDestroyed() || false;

    return resultPromise;
  };

  const setGlobalConfig = (config: Partial<NoticationOptions<NCP>>) => {
    globalConfigRef.value = {
      ...globalConfigRef.value,
      ...config,
    };

    noticationRef.current?.sync();
  };

  return {
    setGlobalConfig,
    open,
    destroyAll: () => noticationRef.current?.instance.destroyAll(),
  };
};

export default createNotication;
