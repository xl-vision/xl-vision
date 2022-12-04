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
} from 'react';

export type NoticationProps<P> = P & {
  visible?: boolean;
  defaultVisible?: boolean;
  onAfterClosed?: () => void;
};

export type NoticationHookProps<P> = Omit<NoticationProps<P>, 'visible' | 'defaultVisible'>;

export type NoticationListProps<P> = P & {
  children: ReactNode;
};

export type NoticationOptions<P> = Omit<NoticationListProps<P>, 'children'> & {
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
  isDestoryed: () => boolean;
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

const useNotication = <P extends object, LP extends object>(
  NoticationList: ComponentType<NoticationListProps<LP>>,
  Notication: ComponentType<NoticationProps<P>>,
  options: NoticationOptions<LP>,
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
        visible: undefined,
        defaultVisible: true,
      };

      let promiseResolve: () => void | undefined;

      const onAfterClosedWrap = (onAfterClosed?: () => void) => () => {
        destroyDOM();
        promiseResolve?.();
        onAfterClosed?.();
      };

      const RefNotication = createRefNotication(Notication, {
        ...currentProps,
        onAfterClosed: onAfterClosedWrap(currentProps.onAfterClosed),
      });

      const ref = createRef<NoticationRef<P>>();

      let destroyState = false;

      const notication = <RefNotication key={`notication${uuid++}`} ref={ref} />;

      const destroyDOM = () => {
        setNotications((prev) => prev.filter((it) => it !== notication));
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
        currentProps = { ...currentProps, ...newProps, visible: undefined, defaultVisible: true };

        render(currentProps);
      };

      const destroy = () => {
        render({
          ...currentProps,
          visible: false,
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
      promise.isDestoryed = () => destroyState;

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
  const holder = <NoticationList {...otherOptions}>{notications}</NoticationList>;

  return [methods, holder] as const;
};

export default useNotication;
