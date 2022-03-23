import React from 'react';
import { ResizeObserverHandler, useConstantFn, useResizeObserver } from '@xl-vision/hooks';
import { env } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import DomWrapper from '../base/DomWrapper';
import findDomNode from '../utils/findDomNode';

export type SingleResizeObserverProps = {
  children: React.ReactElement;
  onResizeObserver?: ResizeObserverHandler;
};

const SingleResizeObserver: React.FunctionComponent<SingleResizeObserverProps> = (props) => {
  const { children, onResizeObserver } = props;

  const handleResizeObserver: ResizeObserverHandler = useConstantFn((state, target) => {
    onResizeObserver?.(state, target);
  });

  const ref = useResizeObserver(handleResizeObserver);

  const refCallback = useConstantFn((instance: DomWrapper) => {
    const element = findDomNode(instance);
    ref(element instanceof Element ? element : null);
  });

  return <DomWrapper ref={refCallback}>{children}</DomWrapper>;
};

if (!env.isProduction) {
  SingleResizeObserver.displayName = 'SingleResizeObserver';
  SingleResizeObserver.propTypes = {
    children: PropTypes.element.isRequired,
    onResizeObserver: PropTypes.func,
  };
}

export default SingleResizeObserver;
