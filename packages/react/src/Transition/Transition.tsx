import PropTypes from 'prop-types';
import { isProduction, warning } from '@xl-vision/utils';
import { CssTransitionOptions, useCssTransition, useForkRef } from '@xl-vision/hooks';
import {
  ReactElement,
  FC,
  Children,
  isValidElement,
  ReactInstance,
  Ref,
  useRef,
  cloneElement,
} from 'react';
import { supportRef } from '../utils/ref';

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

  const child = Children.only(
    typeof children === 'function' ? children(show) : (children as ReactElement),
  );

  warning(!supportRef(child), '<%s>: child does not support ref', displayName);

  const forkRef = useForkRef(
    isValidElement<ReactInstance>(child) ? (child as { ref?: Ref<unknown> }).ref : null,
    nodeRef,
  );

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
    children: PropTypes.oneOfType([PropTypes.element.isRequired, PropTypes.func.isRequired]),
    disableCss: PropTypes.bool,
    in: PropTypes.bool,
    mountOnEnter: PropTypes.bool,
    timeout: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.exact({
        appear: PropTypes.number,
        disappear: PropTypes.number,
        enter: PropTypes.number,
        exit: PropTypes.number,
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
