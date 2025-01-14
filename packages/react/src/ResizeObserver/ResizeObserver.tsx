import { ResizeObserverHandler } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, FC, Children, isValidElement } from 'react';
import SingleResizeObserver from './SingleResizeObserver';

export { type ResizeObserverHandler } from '@xl-vision/hooks';

export type ResizeObserverProps = {
  children: ReactNode;
  onResizeObserver?: ResizeObserverHandler;
};

const INTERNAL_KEY_PREFIX = '$$resize_observer';

const ResizeObserver: FC<ResizeObserverProps> = (props) => {
  const { children, onResizeObserver: handleResizeObserver } = props;

  const parsedChildren = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
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

if (!isProduction) {
  ResizeObserver.displayName = 'ResizeObserver';
  ResizeObserver.propTypes = {
    children: PropTypes.node.isRequired,
    onResizeObserver: PropTypes.func,
  };
}

export default ResizeObserver;
