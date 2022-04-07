import { useConstantFn, useForkRef } from '@xl-vision/hooks';
import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { CSSObject } from '@xl-vision/styled-engine';
import { isProduction, isServer, isWindow } from '@xl-vision/utils';
import Affix from '../Affix';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';
import { off, on } from '../utils/event';
import { oneOf } from '../utils/function';
import { throttleByAnimationFrame } from '../utils/perf';
import { getScroll, scrollTo } from '../utils/scroll';
import AnchorContext from './AnchorContext';

export type AnchorType = 'block' | 'rail';

export type AnchorProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  affix?: boolean;
  scrollTarget?: Window | HTMLElement | (() => Window | HTMLElement);
  affixTarget?: Window | HTMLElement | (() => Window | HTMLElement);
  offsetTop?: number;
  offsetBottom?: number;
  onChange?: (currentActiveLink: string) => void;
  bounds?: number;
  targetOffset?: number;
  type?: AnchorType;
};

const displayName = 'Anchor';

const AnchorRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})<{ type: AnchorType }>(({ theme, styleProps }) => {
  const { type } = styleProps;

  const { color } = theme;

  const style: CSSObject = {
    position: 'relative',
  };

  if (type === 'rail') {
    style.borderLeft = `2px solid ${color.divider}`;
  }

  return style;
});

const AnchorInk = styled('div', {
  name: displayName,
  slot: 'Ink',
})(({ theme }) => {
  const { color, transition } = theme;

  return {
    position: 'absolute',
    left: -10 / 2 - 1,
    border: `2px solid ${color.themes.primary.color}`,
    width: 10,
    height: 10,
    marginTop: -10 / 2,
    borderRadius: '50%',
    background: color.background.paper,
    transition: transition.standard('top'),
  };
});

const HREF_MATCHER_REGX = /#([\S ]+)$/;

const getDefaultTarget = () => window;

export type AnchorInstance = Omit<HTMLDivElement, 'scrollTo'> & {
  scrollTo: (link: string) => void;
};

const Anchor = React.forwardRef<AnchorInstance, AnchorProps>((props, ref) => {
  const { clsPrefix } = useTheme();

  const {
    affix = true,
    affixTarget: affixTargetProp,
    scrollTarget: scrollTargetProp,
    offsetBottom,
    offsetTop,
    onChange,
    bounds = 5,
    targetOffset = 0,
    className,
    type = 'rail',
    children,
    ...others
  } = props;

  // 默认affixTarget和scrollTarget相同
  const affixTarget = affixTargetProp || scrollTargetProp || getDefaultTarget;
  const scrollTarget = scrollTargetProp || affixTarget;

  const rootRef = React.useRef<AnchorInstance>(null);

  const forkRef = useForkRef(ref, rootRef);

  const [currentScrollTarget, setCurrentScrollTarget] = React.useState<Window | HTMLElement>();

  const [links, setLinks] = React.useState<Array<string>>([]);

  const [activeLink, setActiveLink] = React.useState('');

  const isScollingRef = React.useRef(false);

  const inkNodeRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const nextScrollTarget = typeof scrollTarget === 'function' ? scrollTarget() : scrollTarget;

    if (currentScrollTarget === nextScrollTarget) {
      return;
    }
    setCurrentScrollTarget(nextScrollTarget);
  });

  const handleScroll = useConstantFn(() => {
    if (isScollingRef.current) {
      return;
    }
    if (!currentScrollTarget) {
      return;
    }
    let activeLinkInfo:
      | {
          link: string;
          top: number;
        }
      | undefined;
    links.forEach((link) => {
      const matched = HREF_MATCHER_REGX.exec(link);
      if (!matched) {
        return;
      }
      const element = document.getElementById(matched[1]);
      if (!element) {
        return;
      }

      const top = getOffsetTop(element, currentScrollTarget);

      if (top > targetOffset + bounds) {
        return;
      }

      if ((activeLinkInfo && activeLinkInfo.top < top) || !activeLinkInfo) {
        activeLinkInfo = {
          top,
          link,
        };
      }
    });

    setActiveLink(activeLinkInfo ? activeLinkInfo.link : '');
  });

  const throttleHandleScroll = React.useMemo(
    () => throttleByAnimationFrame(handleScroll),
    [handleScroll],
  );

  const registerLink = React.useCallback((link: string) => {
    setLinks((prev) => [...prev, link]);
  }, []);

  const unregisterLink = React.useCallback((link: string) => {
    setLinks((prev) => prev.filter((it) => it !== link));
    setActiveLink((prev) => (prev === link ? '' : prev));
  }, []);

  const handleScrollTo = useConstantFn((link: string) => {
    if (!currentScrollTarget) {
      return;
    }
    if (!oneOf(links, link)) {
      link = '';
    }
    setActiveLink(link);

    if (!link) {
      return;
    }

    const matched = HREF_MATCHER_REGX.exec(link);
    if (!matched) {
      return;
    }

    const targetElement = document.getElementById(matched[1]);

    if (!targetElement) {
      return;
    }

    const scrollTop = getScroll(currentScrollTarget, true);
    const eleOffsetTop = getOffsetTop(targetElement, currentScrollTarget);
    const y = scrollTop + eleOffsetTop - targetOffset;

    isScollingRef.current = true;

    scrollTo(y, {
      container: currentScrollTarget,
      callback: () => {
        isScollingRef.current = false;
      },
    });
  });

  const updateInkNode = useConstantFn(() => {
    const rootNode = rootRef.current;

    const inkNode = inkNodeRef.current;

    if (!rootNode || !inkNode) {
      return;
    }

    const activeNode = rootNode.querySelector<HTMLAnchorElement>(
      `.${clsPrefix}-anchor-link__title--active`,
    );

    if (activeNode) {
      const top = activeNode.offsetTop + activeNode.clientHeight / 2;
      inkNode.style.top = `${top}px`;
    }
  });

  const handleActiveLinkChange = useConstantFn((link: string) => {
    onChange?.(link);
    updateInkNode();
  });

  React.useEffect(() => {
    handleActiveLinkChange(activeLink);
  }, [activeLink, handleActiveLinkChange]);

  // 将input focus绑定到span上
  React.useEffect(() => {
    if (rootRef.current) {
      rootRef.current.scrollTo = throttleHandleScroll;
    }
  }, [throttleHandleScroll]);

  React.useEffect(() => {
    if (!currentScrollTarget) {
      return;
    }

    throttleHandleScroll();
    on(currentScrollTarget, 'scroll', throttleHandleScroll);
    return () => {
      throttleHandleScroll.cancel?.();
      off(currentScrollTarget, 'scroll', throttleHandleScroll);
    };
  }, [currentScrollTarget, throttleHandleScroll]);

  // 内容改变时，需要重新定位
  React.useEffect(() => {
    throttleHandleScroll();
  }, [children, throttleHandleScroll]);

  const value = React.useMemo(() => {
    return {
      registerLink,
      unregisterLink,
      activeLink,
      scrollTo: handleScrollTo,
    };
  }, [activeLink, handleScrollTo, registerLink, unregisterLink]);

  const rootClassName = `${clsPrefix}-anchor`;

  const rootClasses = clsx(rootClassName, `${rootClassName}--${type}`, className);

  const inkNode =
    type === 'rail' && activeLink ? (
      <AnchorInk className={`${rootClassName}__ink`} ref={inkNodeRef} />
    ) : null;

  const content = (
    <AnchorRoot
      {...others}
      styleProps={{ type }}
      className={rootClasses}
      ref={forkRef as React.LegacyRef<HTMLDivElement>}
    >
      {inkNode}
      {children}
    </AnchorRoot>
  );

  return (
    <AnchorContext.Provider value={value}>
      {affix ? (
        <Affix {...others} target={affixTarget} offsetBottom={offsetBottom} offsetTop={offsetTop}>
          {content}
        </Affix>
      ) : (
        content
      )}
    </AnchorContext.Provider>
  );
});

if (!isProduction) {
  Anchor.displayName = displayName;
  Anchor.propTypes = {
    affix: PropTypes.bool,
    affixTarget: PropTypes.oneOfType([
      PropTypes.func,
      ...(isServer
        ? [PropTypes.any]
        : [PropTypes.instanceOf(Window), PropTypes.instanceOf(HTMLElement)]),
    ]),
    scrollTarget: PropTypes.oneOfType([
      PropTypes.func,
      ...(isServer
        ? [PropTypes.any]
        : [PropTypes.instanceOf(Window), PropTypes.instanceOf(HTMLElement)]),
    ]),
    offsetBottom: PropTypes.number,
    offsetTop: PropTypes.number,
    bounds: PropTypes.number,
    targetOffset: PropTypes.number,
    onChange: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.oneOf(['rail', 'block']),
    children: PropTypes.node,
  };
}

export default Anchor;

const getOffsetTop = (element: HTMLElement, container: Window | HTMLElement): number => {
  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    if (isWindow(container)) {
      container = element.ownerDocument.documentElement;
      return rect.top - container.clientTop;
    }
    return rect.top - container.getBoundingClientRect().top;
  }

  return rect.top;
};
