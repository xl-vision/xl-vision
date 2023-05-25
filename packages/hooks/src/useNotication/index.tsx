import { isProduction, warning as warningLog } from '@xl-vision/utils';
import {
  forwardRef,
  useState,
  useImperativeHandle,
  ReactElement,
  createRef,
  useCallback,
  useMemo,
  useRef,
  ComponentType,
  ReactNode,
  ReactFragment,
} from 'react';
import { flushSync } from 'react-dom';

export type NoticationProps<P> = P & {
  open?: boolean;
  defaultOpen?: boolean;
  onAfterClosed?: () => void;
};

export type NoticationHookProps<P> = Omit<NoticationProps<P>, 'open' | 'defaultOpen'>;

export type NoticationContainerProps<NCP> = NCP & {
  children: ReactNode;
};

export type NoticationContainerType<NCP> =
  | ComponentType<NoticationContainerProps<NCP>>
  | string
  | ReactFragment;

export type NoticationOptions<NCP> = Omit<NoticationContainerProps<NCP>, 'children'> & {
  maxCount?: number;
};

export type NoticationHookUpdate<P> = (
  props:
    | Partial<NoticationHookProps<P>>
    | ((prev: NoticationHookProps<P>) => Partial<NoticationHookProps<P>>),
) => void;

export type NoticationHookReturnType<P> = Promise<void> & {
  destroy: () => void;
  update: NoticationHookUpdate<P>;
  isDestroyed: () => boolean;
};

type NoticationRef<P> = {
  update: (updateProps: NoticationProps<P>) => void;
};

const createRefNotication = <P,>(
  Notication: ComponentType<NoticationProps<P>>,
  props: NoticationProps<P>,
) => {
  const RefNotication = forwardRef<NoticationRef<P>>((_, ref) => {
    const [noticationProps, setNoticationProps] = useState(props);

    useImperativeHandle(ref, () => {
      return {
        update(updateProps) {
          setNoticationProps(updateProps);
        },
      };
    });

    return <Notication {...noticationProps} />;
  });

  if (!isProduction) {
    RefNotication.displayName = 'RefNotication';
  }

  return RefNotication;
};

let uuid = 0;

const useNotication = <P, NCP>(
  Notication: ComponentType<NoticationProps<P>>,
  NoticationContainer: NoticationContainerType<NCP>,
  options: NoticationOptions<NCP>,
) => {
  const [notications, setNotications] = useState<Array<ReactElement>>([]);
  const destorysRef = useRef<Array<() => void>>([]);

  const { maxCount, ...otherOptions } = options;

  const method = useCallback(
    (props: NoticationHookProps<P>): NoticationHookReturnType<P> => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let currentProps: NoticationProps<P> = {
        ...props,
        open: undefined,
        defaultOpen: true,
      };

      let promiseResolve: () => void | undefined;

      const onAfterClosedWrap = (onAfterClosed?: () => void) => () => {
        destroyDOM();
        onAfterClosed?.();
        promiseResolve?.();
      };

      const RefNotication = createRefNotication(Notication, {
        ...currentProps,
        onAfterClosed: onAfterClosedWrap(currentProps.onAfterClosed),
      });

      const ref = createRef<NoticationRef<P>>();

      let destroyState = false;

      const notication = <RefNotication key={`notication${uuid++}`} ref={ref} />;

      const destroyDOM = () => {
        flushSync(() => {
          setNotications((prev) => prev.filter((it) => it !== notication));
        });
        destorysRef.current = destorysRef.current.filter((it) => it !== destroy);
        destroyState = true;
      };

      const render = (renderProps: NoticationProps<P>) => {
        if (destroyState) {
          return warningLog(
            true,
            `The notication instance was destroyed, please do not update or destroy it again.`,
          );
        }
        ref.current?.update({
          ...renderProps,
          onAfterClosed: onAfterClosedWrap(renderProps.onAfterClosed),
        });
      };

      const update: NoticationHookUpdate<P> = (updateProps) => {
        const newProps =
          typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;
        currentProps = { ...currentProps, ...newProps, open: undefined, defaultOpen: true };

        render(currentProps);
      };

      const destroy = () => {
        render({
          ...currentProps,
          open: false,
        });
      };

      destorysRef.current.push(destroy);

      setNotications((prev) => [...prev, notication]);

      const destroyFns = destorysRef.current;

      if (maxCount && maxCount > 0 && maxCount < destroyFns.length) {
        const needDestroyedNotications = destroyFns.slice(0, destroyFns.length - maxCount);

        needDestroyedNotications.forEach((it) => it());
      }

      const promise = new Promise<void>((resolve) => {
        promiseResolve = resolve;
      }) as NoticationHookReturnType<P>;

      promise.update = update;
      promise.destroy = destroy;
      promise.isDestroyed = () => destroyState;

      return promise;
    },
    [Notication, maxCount],
  );

  const methods = useMemo(
    () => ({
      open: (props: NoticationHookProps<P>) => method(props),
      destroyAll: () => {
        const destroyFns = destorysRef.current;
        let fn = destroyFns.pop();
        while (fn) {
          fn();
          fn = destroyFns.pop();
        }
      },
    }),
    [method],
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const holder = <NoticationContainer {...otherOptions}>{notications}</NoticationContainer>;

  return [methods, holder] as const;
};

export default useNotication;
