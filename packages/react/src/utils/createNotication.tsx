import {
  NoticationContainerProps,
  NoticationContainerType,
  NoticationHookProps,
  NoticationHookReturnType,
  NoticationOptions,
  NoticationProps,
  useNotication,
} from '@xl-vision/hooks';
import { isProduction, isServer, noop } from '@xl-vision/utils';
import {
  ComponentType,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
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
  if (isServer) {
    return {
      setGlobalConfig: noop,
      open: () => {
        const promise = Promise.resolve({
          update: noop,
          destroy: noop,
          isDestroyed: () => true,
        }) as unknown as NoticationHookReturnType<P>;

        promise.update = noop;
        promise.destroy = noop;
        promise.destroy = () => true;

        return promise;
      },
      destroyAll: noop,
    };
  }

  const globalConfigRef = {
    value: {
      ...defaultGlobalConfig,
    },
  };

  const MethodRefNotication = forwardRef<MethodNoticationRef<P, NCP>, { onCreated: () => void }>(
    ({ onCreated }, ref) => {
      const [noticationListState, setNoticationListState] = useState(globalConfigRef.value);

      const [methods, holder] = useNotication(Notication, NoticationContainer, noticationListState);

      useImperativeHandle(ref, () => {
        return {
          instance: methods,
          sync() {
            setNoticationListState(globalConfigRef.value);
          },
        };
      }, [methods]);

      useEffect(() => {
        onCreated();
      }, [onCreated]);

      return holder;
    },
  );

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

      promise = promise.then(
        () =>
          new Promise<void>((resolve) => {
            // render后不一定会设置ref值，需要通过组件创建完成事件来判断
            // eslint-disable-next-line react/jsx-handler-names
            root?.render(<MethodRefNotication ref={noticationRef} onCreated={resolve} />);
          }),
      );
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
