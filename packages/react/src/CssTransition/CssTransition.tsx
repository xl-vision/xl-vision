import PropTypes from 'prop-types';
import React from 'react';
import { isProduction, warning } from '@xl-vision/utils';
import { CssTransitionOptions, useCssTransition, useForkRef } from '@xl-vision/hooks';
import { supportRef } from '../utils/ref';

export type CssTransitionProps = CssTransitionOptions & {
  children: React.ReactElement | ((show: boolean) => React.ReactElement);
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
};

const displayName = 'CssTransition';

const CssTransition: React.FunctionComponent<CssTransitionProps> = (props) => {
  const { children, mountOnEnter, unmountOnExit, in: inProp, ...others } = props;

  const { nodeRef, show } = useCssTransition({
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

  if (!show) {
    if (mountOnEnter && isFirstMountRef.current) {
      return null;
    }
    if (unmountOnExit) {
      return null;
    }
  }
  isFirstMountRef.current = false;

  return React.cloneElement(child, {
    ref: forkRef,
  });
};

if (!isProduction) {
  CssTransition.displayName = displayName;

  CssTransition.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element.isRequired, PropTypes.func.isRequired]),
    mountOnEnter: PropTypes.bool,
    unmountOnExit: PropTypes.bool,
    onEnter: PropTypes.func,
    onEntering: PropTypes.func,
    onEntered: PropTypes.func,
    onEnterCancelled: PropTypes.func,
    onExit: PropTypes.func,
    onExiting: PropTypes.func,
    onExited: PropTypes.func,
    onExitCancelled: PropTypes.func,

    in: PropTypes.bool,
    transitionOnFirst: PropTypes.bool,
    disableCss: PropTypes.bool,
    timeout: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.exact({
        appear: PropTypes.number,
        enter: PropTypes.number,
        exit: PropTypes.number,
        disappear: PropTypes.number,
      }),
    ]),
    transitionClassName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.exact({
        appearActive: PropTypes.string,
        appearFrom: PropTypes.string,
        appearTo: PropTypes.string,
        enterActive: PropTypes.string,
        enterFrom: PropTypes.string,
        enterTo: PropTypes.string,
        exitActive: PropTypes.string,
        exitFrom: PropTypes.string,
        exitTo: PropTypes.string,
        disappearActive: PropTypes.string,
        disappearFrom: PropTypes.string,
        disappearTo: PropTypes.string,
      }),
    ]),
  };
}

export default CssTransition;
