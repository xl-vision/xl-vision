import { setRef } from '@xl-vision/utils';
import { HTMLProps, MutableRefObject, Ref, RefCallback, useCallback, useMemo, useRef } from 'react';

export type InteractionContext = {
  reference: RefCallback<Element>;
  popper: RefCallback<Element>;
  update: () => void;
};

export type InteractionReturn = {
  reference?: HTMLProps<Element>;
  popper?: HTMLProps<Element>;
};

export type InteractionHookOptions = {
  reference: MutableRefObject<Element | null>;
  popper: MutableRefObject<Element | null>;
  update: () => void;
};

export type InteractionHook = (options: InteractionHookOptions) => InteractionReturn;

const useInteractions = (interactionContext: InteractionContext, hooks: Array<InteractionHook>) => {
  const { reference, popper, update } = interactionContext;

  const referenceRef = useRef<Element | null>(null);
  const popperRef = useRef<Element | null>(null);

  const setReference: RefCallback<Element> = useCallback(
    (el) => {
      referenceRef.current = el;
      reference(el);
    },
    [reference],
  );
  const setPopper: RefCallback<Element> = useCallback(
    (el) => {
      popperRef.current = el;
      popper(el);
    },
    [popper],
  );

  const hookProps = useMemo(() => {
    return hooks
      .map((it) => it({ reference: referenceRef, popper: popperRef, update }))
      .reduce(
        (
          prev: { reference: Array<HTMLProps<Element>>; popper: Array<HTMLProps<Element>> },
          value,
        ) => {
          const { reference: referenceValue, popper: popperValue } = value;
          if (referenceValue) {
            prev.reference.push(referenceValue);
          }
          if (popperValue) {
            prev.popper.push(popperValue);
          }

          return prev;
        },
        {
          reference: [
            {
              ref: setReference,
            },
          ],
          popper: [
            {
              ref: setPopper,
            },
          ],
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...hooks]);

  const getReferenceProps = useCallback(
    (userProps?: HTMLProps<Element>) => {
      return mergeProps(userProps, hookProps.reference);
    },
    [hookProps],
  );

  const getPopperProps = useCallback(
    (userProps?: HTMLProps<Element>) => {
      return mergeProps(userProps, hookProps.popper);
    },
    [hookProps],
  );

  return {
    getReferenceProps,
    getPopperProps,
  };
};

export default useInteractions;

const mergeProps = (
  userProps: HTMLProps<Element> | undefined,
  propsList: Array<HTMLProps<Element>>,
): Record<string, unknown> => {
  const map = new Map<string, Array<(...args: Array<unknown>) => void>>();

  const refs: Array<Ref<Element>> = [];

  return [userProps || {}, ...propsList].reduce((acc: Record<string, unknown>, props) => {
    Object.entries(props).forEach(([key, value]) => {
      if (key.indexOf('on') === 0) {
        if (!map.has(key)) {
          map.set(key, []);
        }
        if (typeof value === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          map.get(key)?.push(value);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        acc[key] = (...args: Array<unknown>) => {
          map.get(key)?.forEach((fn) => fn(...args));
        };
      } else if (key === 'ref') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        refs.push(value);
        acc[key] = (node: Element) => {
          refs.forEach((it) => {
            setRef(it, node);
          });
        };
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        acc[key] = value;
      }
    });

    return acc;
  }, {});
};
