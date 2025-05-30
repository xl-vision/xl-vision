import {
  ResizeObserverHandler,
  useConstantFn,
  useForkRef,
  useResizeObserver,
} from '@xl-vision/hooks';
import { isProduction, warning } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactElement, Children, cloneElement, FC } from 'react';
import useNativeElementRef from '../hooks/useNativeElementRef';
import { getNodeRef, supportRef } from '../utils/ref';

export type SingleResizeObserverProps = {
  children: ReactElement<unknown>;
  onResizeObserver?: ResizeObserverHandler;
};

const displayName = 'SingleResizeObserver';

const SingleResizeObserver: FC<SingleResizeObserverProps> = (props) => {
  const { children, onResizeObserver } = props;

  const handleResizeObserver: ResizeObserverHandler = useConstantFn((state, target) => {
    onResizeObserver?.(state, target);
  });

  const resizeRef = useResizeObserver(handleResizeObserver);

  const child = Children.only(children);

  warning(!supportRef(child), '<%s>: child does not support ref', displayName);

  const forkRef = useForkRef(useNativeElementRef(resizeRef), getNodeRef(child));

  return cloneElement(child as ReactElement<{ ref?: typeof forkRef }>, {
    ref: forkRef,
  });
};

if (!isProduction) {
  SingleResizeObserver.displayName = displayName;
  SingleResizeObserver.propTypes = {
    children: PropTypes.element.isRequired,
    onResizeObserver: PropTypes.func,
  };
}

export default SingleResizeObserver;
