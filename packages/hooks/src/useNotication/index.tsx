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
  ExoticComponent,
} from 'react';
import { flushSync } from 'react-dom';

export type NoticationProps = {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  onAfterClosed?: () => void;
};

export type NoticationHookProps<P extends NoticationProps> = Omit<P, 'open' | 'onOpenChange'>;

export type NoticationContainerProps = {
  children: ReactNode;
};

export type NoticationContainerType<NCP extends NoticationContainerProps> =
  | ComponentType<NCP>
  | string
  | ExoticComponent;

export type NoticationOptions<NCP extends NoticationContainerProps> = Omit<NCP, 'children'> & {
  maxCount?: number;
};

export type NoticationHookUpdate<P extends NoticationProps> = (
  props:
    | Partial<NoticationHookProps<P>>
    | ((prev: NoticationHookProps<P>) => Partial<NoticationHookProps<P>>),
) => void;

export type NoticationMethods<P extends NoticationProps> = {
  destroy: () => void;
  update: NoticationHookUpdate<P>;
  isDestroyed: () => boolean;
};

export type NoticationHookReturnType<P extends NoticationProps> = Promise<NoticationMethods<P>> &
  NoticationMethods<P>;

type NoticationRef<P> = {
  update: (updateProps: P) => void;
};

const createRefNotication = <P extends object>(Notication: ComponentType<P>, props: P) => {
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

const useNotication = <P extends NoticationProps, NCP extends NoticationContainerProps>(
  Notication: ComponentType<P>,
  NoticationContainer: NoticationContainerType<NCP>,
  options: NoticationOptions<NCP>,
) => {
  const [notications, setNotications] = useState<Array<ReactElement>>([]);
  const destorysRef = useRef<Array<() => void>>([]);

  const keyRef = useRef(0);

  const { maxCount, ...otherOptions } = options;

  const method = useCallback(
    (props: NoticationHookProps<P>): NoticationHookReturnType<P> => {
      let currentProps = {
        ...props,
        open: true,
        onOpenChange: (value) => {
          if (value === currentProps.open) {
            return;
          }
          render({
            ...currentProps,
            open: value,
          });
        },
      } as P;

      let promiseResolve: (props: NoticationMethods<P>) => void | undefined;

      const onAfterClosedWrap = (onAfterClosed?: () => void) => () => {
        destroyDOM();
        onAfterClosed?.();
        promiseResolve?.({
          update,
          destroy,
          isDestroyed: () => destroyState,
        });
      };

      const RefNotication = createRefNotication(Notication, {
        ...currentProps,
        onAfterClosed: onAfterClosedWrap(currentProps.onAfterClosed),
      });

      const ref = createRef<NoticationRef<P>>();

      let destroyState = false;

      const notication = <RefNotication key={`notication${keyRef.current++}`} ref={ref} />;

      const destroyDOM = () => {
        flushSync(() => {
          setNotications((prev) => prev.filter((it) => it !== notication));
        });
        destorysRef.current = destorysRef.current.filter((it) => it !== destroy);
        destroyState = true;
      };

      const render = (renderProps: P) => {
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
        currentProps = {
          ...currentProps,
          ...newProps,
          open: currentProps.open,
          onOpenChange: currentProps.onOpenChange,
        };

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

      const promise = new Promise<NoticationMethods<P>>((resolve) => {
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

  const holder = (
    <NoticationContainer {...(otherOptions as NCP)}>{notications}</NoticationContainer>
  );

  return [methods, holder] as const;
};

export default useNotication;
