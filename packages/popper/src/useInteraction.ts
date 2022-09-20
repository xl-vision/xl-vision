import { useConstantFn } from '@xl-vision/hooks';
import { isDevelopment } from '@xl-vision/utils';
import { HTMLProps } from 'react';
import { InteractionContext } from './useConnectInteraction';

export type InteractionReturn = {
  reference?: HTMLProps<Element>;
  popper?: HTMLProps<Element>;
};

export type InteractionHook<T extends any | void = void> = (
  ctx: InteractionContext,
  options?: T & { skip?: boolean },
) => InteractionReturn | void;

const useInteraction = (...hookReturns: Array<InteractionReturn | void>) => {
  const getReferenceProps = useConstantFn((userProps?: HTMLProps<Element>) => {
    return mergeProps(userProps, hookReturns, 'reference');
  });

  const getPopperProps = useConstantFn((userProps?: HTMLProps<Element>) => {
    return mergeProps(userProps, hookReturns, 'popper');
  });

  return {
    getReferenceProps,
    getPopperProps,
  };
};

export default useInteraction;

const mergeProps = (
  userProps: HTMLProps<Element> | undefined,
  hookReturns: Array<InteractionReturn | void>,
  target: 'reference' | 'popper',
): Record<string, unknown> => {
  const map = new Map<string, Array<(...args: Array<unknown>) => void>>();

  const propsList = hookReturns.reduce(
    (prev: { reference: Array<HTMLProps<Element>>; popper: Array<HTMLProps<Element>> }, value) => {
      const { reference: referenceValue, popper: popperValue } = value || {};
      if (referenceValue) {
        prev.reference.push(referenceValue);
      }
      if (popperValue) {
        prev.popper.push(popperValue);
      }

      return prev;
    },
    {
      reference: [{}],
      popper: [{}],
    },
  );

  return [userProps || {}, ...propsList[target]].reduce((acc: Record<string, unknown>, props) => {
    Object.entries(props).forEach(([key, value]) => {
      if (isDevelopment) {
        if (key === 'ref') {
          throw new Error('ref is not allowed in props');
        }
      }
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
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore

        acc[key] = value;
      }
    });

    return acc;
  }, {});
};
