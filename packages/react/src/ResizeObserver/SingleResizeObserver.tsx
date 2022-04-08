import React from 'react';
import {
  ResizeObserverHandler,
  useConstantFn,
  useForkRef,
  useResizeObserver,
} from '@xl-vision/hooks';
import { isProduction, warning } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { supportRef } from '../utils/ref';

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

  const child: React.ReactElement = React.Children.only(children);

  warning(!supportRef(child), '<%s>: child does not support ref', displayName);

  const forkRef = useForkRef(
    resizeRef,
    ref,
    (child as unknown as { ref?: React.Ref<unknown> }).ref,
  );

  return React.cloneElement(child, {
    ref: forkRef,
  });
});

if (!isProduction) {
  SingleResizeObserver.displayName = displayName;
  SingleResizeObserver.propTypes = {
    children: PropTypes.element.isRequired,
    onResizeObserver: PropTypes.func,
  };
}

export default SingleResizeObserver;
