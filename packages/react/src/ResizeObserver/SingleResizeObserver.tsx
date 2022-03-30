import React from 'react';
import {
  ResizeObserverHandler,
  useConstantFn,
  useForkRef,
  useResizeObserver,
} from '@xl-vision/hooks';
import { env } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { supportRef } from '../utils/ref';
import warning from '../utils/warning';

export type SingleResizeObserverProps = {
  children: React.ReactElement;
  onResizeObserver?: ResizeObserverHandler;
};

const displayName = 'SingleResizeObserver';

const SingleResizeObserver = React.forwardRef<unknown, SingleResizeObserverProps>((props, ref) => {
  const { children, onResizeObserver } = props;

  const handleResizeObserver: ResizeObserverHandler = useConstantFn((state, target) => {
    onResizeObserver?.(state, target);
  });

  const resizeRef = useResizeObserver(handleResizeObserver);

  const child = React.Children.only(children);

  warning(!supportRef(child), '<%s>: child does not support ref', displayName);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const forkRef = useForkRef(resizeRef, ref, (child as any).ref);

  return React.cloneElement(child, {
    ref: forkRef,
  });
});

if (!env.isProduction) {
  SingleResizeObserver.displayName = displayName;
  SingleResizeObserver.propTypes = {
    children: PropTypes.element.isRequired,
    onResizeObserver: PropTypes.func,
  };
}

export default SingleResizeObserver;