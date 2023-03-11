import { ResizeObserverHandler, useEvent, useForkRef, useResizeObserver } from '@xl-vision/hooks';
import { isProduction, warning } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactElement, forwardRef, Children, Ref, cloneElement } from 'react';
import { supportRef } from '../utils/ref';

export type SingleResizeObserverProps = {
  children: ReactElement;
  onResizeObserver?: ResizeObserverHandler;
};

const displayName = 'SingleResizeObserver';

const SingleResizeObserver = forwardRef<unknown, SingleResizeObserverProps>((props, ref) => {
  const { children, onResizeObserver } = props;

  const handleResizeObserver: ResizeObserverHandler = useEvent((state, target) => {
    onResizeObserver?.(state, target);
  });

  const resizeRef = useResizeObserver(handleResizeObserver);

  const child: ReactElement = Children.only(children);

  warning(!supportRef(child), '<%s>: child does not support ref', displayName);

  const forkRef = useForkRef(resizeRef, ref, (child as unknown as { ref?: Ref<unknown> }).ref);

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
