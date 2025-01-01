import { CssTransitionOptions, useCssTransition, useForkRef } from '@xl-vision/hooks';
import { isProduction, warning } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactElement, FC, Children, useRef, cloneElement } from 'react';
import { getNodeRef, supportRef } from '../utils/ref';

export type TransitionProps = CssTransitionOptions & {
  children: ReactElement | ((show: boolean) => ReactElement);
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
};

const displayName = 'Transition';

const Transition: FC<TransitionProps> = (props) => {
  const { children, mountOnEnter, unmountOnExit, in: inProp, ...others } = props;

  const { nodeRef, show } = useCssTransition({
    ...others,
    in: inProp,
  });

  const child = Children.only(typeof children === 'function' ? children(show) : children);

  warning(!supportRef(child), '<%s>: child does not support ref', displayName);

  const forkRef = useForkRef(getNodeRef(child), nodeRef);

  // 判断是否是第一次挂载
  const isFirstMountRef = useRef(true);

  if (!show) {
    if (mountOnEnter && isFirstMountRef.current) {
      return null;
    }
    if (unmountOnExit) {
      return null;
    }
  }
  isFirstMountRef.current = false;

  return cloneElement(child, {
    ref: forkRef,
  });
};

if (!isProduction) {
  Transition.displayName = displayName;

  Transition.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element.isRequired, PropTypes.func.isRequired])
      .isRequired,
    in: PropTypes.bool.isRequired,
    disableCss: PropTypes.bool,
    mountOnEnter: PropTypes.bool,
    timeout: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.exact({
        appear: PropTypes.number.isRequired,
        disappear: PropTypes.number.isRequired,
        enter: PropTypes.number.isRequired,
        exit: PropTypes.number.isRequired,
      }),
    ]),
    transitionClassName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.exact({
        appearActive: PropTypes.string.isRequired,
        appearFrom: PropTypes.string.isRequired,
        appearTo: PropTypes.string.isRequired,
        enterActive: PropTypes.string.isRequired,
        enterFrom: PropTypes.string.isRequired,
        enterTo: PropTypes.string.isRequired,
        exitActive: PropTypes.string.isRequired,
        exitFrom: PropTypes.string.isRequired,
        exitTo: PropTypes.string.isRequired,
        disappearActive: PropTypes.string.isRequired,
        disappearFrom: PropTypes.string.isRequired,
        disappearTo: PropTypes.string.isRequired,
      }),
    ]),
    transitionOnFirst: PropTypes.bool,
    unmountOnExit: PropTypes.bool,
    onEnter: PropTypes.func,
    onEnterCancelled: PropTypes.func,
    onEntered: PropTypes.func,
    onEntering: PropTypes.func,
    onExit: PropTypes.func,
    onExitCancelled: PropTypes.func,
    onExited: PropTypes.func,
    onExiting: PropTypes.func,
  };
}

export default Transition;
