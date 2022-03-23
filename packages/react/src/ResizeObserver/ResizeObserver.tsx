import { ResizeObserverHandler } from '@xl-vision/hooks';
import { env } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import React from 'react';
import SingleResizeObserver from './SingleResizeObserver';

export type ResizeObserverProps = {
  children: React.ReactNode;
  onResizeObserver?: ResizeObserverHandler;
};

const INTERNAL_KEY_PREFIX = '$$resize_observer';

const ResizeObserver: React.FunctionComponent<ResizeObserverProps> = (props) => {
  const { children, onResizeObserver: handleResizeObserver } = props;

  const parsedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const key = child.key || `${INTERNAL_KEY_PREFIX}-${index}`;
      return (
        <SingleResizeObserver key={key} onResizeObserver={handleResizeObserver}>
          {child}
        </SingleResizeObserver>
      );
    }
    return child;
  });

  return <>{parsedChildren}</>;
};

if (!env.isProduction) {
  ResizeObserver.displayName = 'ResizeObserver';
  ResizeObserver.propTypes = {
    children: PropTypes.node.isRequired,
    onResizeObserver: PropTypes.func,
  };
}

export default ResizeObserver;
