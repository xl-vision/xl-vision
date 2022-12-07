import {
  NoticationContainerType,
  NoticationHookReturnType,
  NoticationOptions,
  NoticationProps,
  useNotication,
} from '@xl-vision/hooks';

import { isProduction } from '@xl-vision/utils';
import { ComponentType, createRef, forwardRef, useImperativeHandle, useState } from 'react';
import ReactDOM from 'react-dom';

type MethodNoticationRef<P, NCP> = {
  instance: ReturnType<typeof useNotication<P, NCP>>[0];
  sync: () => void;
};

const createNotication = <P, NCP>(
  Notication: ComponentType<NoticationProps<P>>,
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
  let count = 0;

  const destroyDOM = () => {
    if (!rootEl) {
      return;
    }
    const unmountResult = ReactDOM.unmountComponentAtNode(rootEl);
    if (unmountResult && rootEl.parentNode) {
      rootEl.parentNode.removeChild(rootEl);
    }

    rootEl = undefined;
  };

  const open = (props: NoticationProps<P>): NoticationHookReturnType<P> => {
    const currentProps = {
      ...props,
    };

    let hookMethods: NoticationHookReturnType<P> | undefined;

    let promiseResolve: () => void | undefined;

    if (!rootEl) {
      const div = document.createElement('div');
      document.body.appendChild(div);
      rootEl = div;

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Promise.resolve().then(() => {
        ReactDOM.render(<MethodRefNotication ref={noticationRef} />, div);
      });
    }

    count++;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.resolve().then(() => {
      hookMethods = noticationRef.current?.instance.open({
        ...currentProps,
        onAfterClosed() {
          count--;
          if (count <= 0) {
            destroyDOM();
          }
          currentProps.onAfterClosed?.();
          promiseResolve?.();
        },
      });
    });

    const promise = new Promise<void>((resolve) => {
      promiseResolve = resolve;
    }) as NoticationHookReturnType<P>;

    promise.update = (updateProps) => hookMethods?.update(updateProps);
    promise.destroy = () => hookMethods?.destroy();
    promise.isDestroyed = () => hookMethods?.isDestroyed() || false;

    return promise;
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
