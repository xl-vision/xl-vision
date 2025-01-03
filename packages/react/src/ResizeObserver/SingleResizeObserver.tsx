import {
  ResizeObserverHandler,
  useConstantFn,
  useForkRef,
  useResizeObserver,
} from '@xl-vision/hooks';
import { isProduction, warning } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactElement, forwardRef, Children, cloneElement } from 'react';
import { getNodeRef, supportRef } from '../utils/ref';

export type SingleResizeObserverProps = {
  children: ReactElement<any>;
  onResizeObserver?: ResizeObserverHandler;
};

const displayName = 'SingleResizeObserver';

const SingleResizeObserver = forwardRef<unknown, SingleResizeObserverProps>((props, ref) => {
  const { children, onResizeObserver } = props;

  const handleResizeObserver: ResizeObserverHandler = useConstantFn((state, target) => {
    onResizeObserver?.(state, target);
  });

  const resizeRef = useResizeObserver(handleResizeObserver);

  const child = Children.only(children);

  warning(!supportRef(child), '<%s>: child does not support ref', displayName);

  const forkRef = useForkRef(resizeRef, ref, getNodeRef(child));

  return cloneElement(child, {
    ref: forkRef,
  });
});

if (!isProduction) {
  SingleResizeObserver.displayName = displayName;
  SingleResizeObserver.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    children: PropTypes.element.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onResizeObserver: PropTypes.func,
  };
}

export default SingleResizeObserver;
