import { EventEmitter, noop } from '@xl-vision/utils';
import { RefObject, RefCallback, useCallback, useMemo, useRef, useState } from 'react';
import { Reference } from './types';
import usePopper from './usePopper';

export type ConnectInteractionOptions = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export type InteractionContext = {
  reference: RefObject<Reference | null>;
  popper: RefObject<Element | null>;
  eventEmitter: EventEmitter;
  data: Record<string, unknown>;
  update: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const useConnectInteraction = (
  popperReturn: ReturnType<typeof usePopper>,
  options?: ConnectInteractionOptions,
): ReturnType<typeof usePopper> & {
  context: InteractionContext;
} => {
  const { reference, popper, update, ...others } = popperReturn;

  const { open = false, setOpen = noop } = options || {};

  const referenceRef = useRef<Reference | null>(null);
  const popperRef = useRef<Element | null>(null);

  const [eventEmitter] = useState(() => new EventEmitter());

  const [data] = useState(() => ({}));

  const setReference: RefCallback<Reference> = useCallback(
    (el) => {
      referenceRef.current = el;
      update();
      reference(el);
    },
    [update, reference],
  );
  const setPopper: RefCallback<Element> = useCallback(
    (el) => {
      popperRef.current = el;
      update();
      popper(el);
    },
    [update, popper],
  );

  const context: InteractionContext = useMemo(() => {
    return {
      update,
      eventEmitter,
      reference: referenceRef,
      popper: popperRef,
      open,
      setOpen,
      data,
    };
  }, [update, eventEmitter, open, setOpen, data]);

  return {
    reference: setReference,
    popper: setPopper,
    update,
    ...others,
    context,
  };
};

export default useConnectInteraction;
