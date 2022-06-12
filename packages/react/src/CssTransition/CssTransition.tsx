import PropTypes from 'prop-types';
import React from 'react';
import { isProduction, warning } from '@xl-vision/utils';
import { CssTransitionOptions, useCssTransition, useForkRef } from '@xl-vision/hooks';
import clsx from 'clsx';
import { supportRef } from '../utils/ref';

export type CssTransitionProps = CssTransitionOptions & {
  children: React.ReactElement | ((show: boolean) => React.ReactElement);
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
};

const displayName = 'CssTransition';

const CssTransition: React.FunctionComponent<CssTransitionProps> = (props) => {
  const { children, mountOnEnter, unmountOnExit, in: inProp, ...others } = props;

  const { nodeRef, activeClassName, show } = useCssTransition({
    ...others,
    in: inProp,
  });

  const child = React.Children.only(
    typeof children === 'function' ? children(show) : (children as React.ReactElement),
  );

  warning(!supportRef(child), '<%s>: child does not support ref', displayName);

  const forkRef = useForkRef(
    React.isValidElement<React.ReactInstance>(child)
      ? (child as { ref?: React.Ref<unknown> }).ref
      : null,
    nodeRef,
  );

  // 判断是否是第一次挂载
  const isFirstMountRef = React.useRef(true);

  if (show) {
    isFirstMountRef.current = false;
  } else {
    if (mountOnEnter && isFirstMountRef.current) {
      return null;
    }
    if (unmountOnExit) {
      return null;
    }
  }

  const prevClassName = (child.props as { className?: string }).className;

  const className = clsx(prevClassName, activeClassName);

  return React.cloneElement(child, {
    ref: forkRef,
    className,
  });
};

if (!isProduction) {
  CssTransition.displayName = displayName;

  CssTransition.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element.isRequired, PropTypes.func.isRequired]),
  };
}

export default CssTransition;
