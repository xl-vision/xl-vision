import React from 'react';
import ReactDOM from 'react-dom';
import { Instance, Placement, createPopper, Modifier } from '@popperjs/core';
import CSSTransition, { CSSTransitionProps } from '../CSSTransition';
import useForkRef from '../hooks/useForkRef';
import Portal, { PortalContainerType } from '../Portal';
import { isDevelopment } from '../utils/env';
import { off, on } from '../utils/event';
import useEventCallback from '../hooks/useEventCallback';
import { include } from '../utils/dom';
import { voidFn } from '../utils/function';

export type PopperTrigger = 'hover' | 'focus' | 'click' | 'contextMenu' | 'custom';

export type PopperPlacement = Placement;

export type PopperProps = {
  children: React.ReactElement;
  popup: React.ReactElement;
  getPopupContainer?: PortalContainerType;
  transitionClasses?: CSSTransitionProps['transitionClasses'];
  trigger?: PopperTrigger;
  placement?: PopperPlacement;
  disablePopupEnter?: boolean;
  offset?: number | string;
};

const displayName = 'Popper';

const TIME_DELAY = 1000 / 60;

const Popper: React.FunctionComponent<PopperProps> = (props) => {
  const {
    children,
    popup,
    getPopupContainer,
    transitionClasses,
    trigger = 'hover',
    disablePopupEnter,
    offset = 10,
    // placement,
  } = props;

  const child = React.Children.only(children);

  const [visible, setVisible] = React.useState(false);

  const popupNodeRef = React.useRef<HTMLDivElement>(null);
  const referenceRef = React.useRef<React.ReactInstance>();
  const timerRef = React.useRef<NodeJS.Timeout>();
  const popperInstanceRef = React.useRef<Instance>();

  const forkRef = useForkRef(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    React.isValidElement(child) ? (child as any).ref : null,
    referenceRef,
  );

  const findReferenceDOM = React.useCallback(() => {
    // eslint-disable-next-line react/no-find-dom-node
    return ReactDOM.findDOMNode(referenceRef.current) as HTMLElement;
  }, []);

  const handleReferenceClick = useEventCallback(() => {
    if (trigger === 'click') {
      setVisible(true);
    }
  });

  const handleReferenceMouseEnter = useEventCallback(() => {
    if (trigger === 'hover') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setVisible(true);
    }
  });

  const handleReferenceMouseLeave = useEventCallback(() => {
    if (trigger === 'hover') {
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, TIME_DELAY);
    }
  });

  const handleReferenceFocus = useEventCallback(() => {
    if (trigger === 'focus') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setVisible(true);
    }
  });

  const handleReferenceBlur = useEventCallback(() => {
    if (trigger === 'focus') {
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, TIME_DELAY);
    }
  });

  const handleReferenceContextMenu = useEventCallback(() => {
    if (trigger === 'contextMenu') {
      setVisible(true);
    }
  });

  const handleClickOutside = useEventCallback((e: MouseEvent | TouchEvent) => {
    if (trigger !== 'click' && trigger !== 'contextMenu') {
      return;
    }
    const el = e.target;
    if (!(el instanceof Element)) {
      return;
    }
    if (include(popupNodeRef.current!, el)) {
      if (!disablePopupEnter) {
        return;
      }
    }
    if (include(findReferenceDOM(), el)) {
      return;
    }
    setVisible(false);
  });

  const handlePopupMouseEnter = useEventCallback(() => {
    if (disablePopupEnter) {
      return;
    }
    if (trigger === 'hover') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  });

  const handlePopupMouseLeave = useEventCallback(() => {
    if (trigger === 'hover') {
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, TIME_DELAY);
    }
  });

  const offsetModifer: Modifier<string, {}> = React.useMemo(() => {
    const offsetStr = typeof offset === 'number' ? offset + 'px' : offset;

    return {
      name: 'offset2',
      enabled: true,
      phase: 'main',
      fn({ state }) {
        const style: Partial<CSSStyleDeclaration> = {};
        const { placement, styles } = state;
        if (/^bottom/.exec(placement)) {
          style.paddingTop = offsetStr;
        }
        styles.popper = { ...styles.popper, ...style };
      },
    };
  }, [offset]);

  React.useEffect(() => {
    if (!visible) {
      return;
    }
    const instance = popperInstanceRef.current;
    if (!instance) {
      const el = findReferenceDOM();
      const popupEl = popupNodeRef.current!;

      popperInstanceRef.current = createPopper(el, popupEl, {
        modifiers: [offsetModifer],
      });
    } else {
      instance.update().then(voidFn, voidFn);
    }
  }, [visible, findReferenceDOM, offsetModifer]);

  React.useEffect(() => {
    const el = findReferenceDOM();
    const popupEl = popupNodeRef.current!;

    on(el, 'click', handleReferenceClick);
    on(el, 'mouseenter', handleReferenceMouseEnter);
    on(el, 'mouseleave', handleReferenceMouseLeave);
    on(el, 'focus', handleReferenceFocus);
    on(el, 'blur', handleReferenceBlur);
    on(el, 'contextmenu', handleReferenceContextMenu);

    on(popupEl, 'mouseenter', handlePopupMouseEnter);
    on(popupEl, 'mouseleave', handlePopupMouseLeave);

    on(window, 'click', handleClickOutside);
    return () => {
      off(el, 'click', handleReferenceClick);
      off(el, 'mouseenter', handleReferenceMouseEnter);
      off(el, 'mouseleave', handleReferenceMouseLeave);
      off(el, 'focus', handleReferenceFocus);
      off(el, 'blur', handleReferenceBlur);
      off(el, 'contextmenu', handleReferenceContextMenu);

      off(popupEl, 'mouseenter', handlePopupMouseEnter);
      off(popupEl, 'mouseleave', handlePopupMouseLeave);

      off(window, 'click', handleClickOutside);
    };
  }, [
    findReferenceDOM,
    handleReferenceClick,
    handleReferenceMouseEnter,
    handleReferenceMouseLeave,
    handleReferenceFocus,
    handleReferenceBlur,
    handleReferenceContextMenu,
    handleClickOutside,
    handlePopupMouseEnter,
    handlePopupMouseLeave,
  ]);

  const beforeEnter = React.useCallback((el: HTMLElement) => {
    el.style.display = '';
  }, []);

  const afterLeave = React.useCallback((el: HTMLElement) => {
    el.style.display = 'none';
  }, []);

  const portal = (
    <Portal getContainer={getPopupContainer}>
      <div ref={popupNodeRef}>
        <CSSTransition
          in={visible}
          transitionClasses={transitionClasses}
          mountOnEnter={true}
          beforeEnter={beforeEnter}
          afterLeave={afterLeave}
        >
          <div style={{ position: 'relative', transformOrigin: '0 0' }}>{popup}</div>
        </CSSTransition>
      </div>
    </Portal>
  );

  const cloneChildren = React.cloneElement(children, {
    ref: forkRef,
  });

  return (
    <>
      {cloneChildren}
      {portal}
    </>
  );
};

if (isDevelopment) {
  Popper.displayName = displayName;
}

export default Popper;
