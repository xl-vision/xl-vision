import {
  HTMLProps,
  MutableRefObject,
  RefCallback,
  RefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import usePopper from './usePopper';

export type PopperContext = ReturnType<typeof usePopper>;

export type InteractionContext = {
  reference?: HTMLProps<Element>;
  popper?: HTMLProps<Element>;
};

export type InteractionHookOptions = {
  reference: MutableRefObject<Element | null>;
  popper: MutableRefObject<Element | null>;
  update: () => void;
};

export type InteractionHook = (options: InteractionHookOptions) => InteractionContext;

const useInteractions = (popperContext: PopperContext, hooks: Array<InteractionHook>) => {
  const { reference, popper, update } = popperContext;

  const referenceRef = useRef<Element | null>(null);
  const popperRef = useRef<Element | null>(null);

  const hookCb = useMemo(() => {
    hooks.map((it) => it({ reference: referenceRef, popper: popperRef, update }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...hooks]);

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

  const getReferenceProps = useCallback(() => {
    return {
      ref: setReference,
    };
  }, [setReference]);

  const getPopperProps = useCallback(() => {
    return {
      ref: setPopper,
    };
  }, [setPopper]);

  return {
    getReferenceProps,
    getPopperProps,
  };
};

export default useInteractions;
