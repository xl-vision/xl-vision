import { useConstantFn } from '@xl-vision/hooks';
import { env } from '@xl-vision/utils';
import React from 'react';
import Affix, { AffixIntance } from '../Affix';
import { styled } from '../styles';
import { getScroll, isWindow, scrollTo } from '../utils/dom';
import { off, on } from '../utils/event';
import { oneOf } from '../utils/function';
import { throttleByAnimationFrame } from '../utils/perf';

export type AnchorProps = {
  affix?: boolean;
  scrollTarget?: Window | HTMLElement | (() => Window | HTMLElement);
  affixTarget?: Window | HTMLElement | (() => Window | HTMLElement);
  offsetTop?: number;
  offsetBottom?: number;
  onChange?: (currentActiveLink: string) => void;
  bounds?: number;
  targetOffset?: number;
};

const displayName = 'Anchor';

const Root = styled('div', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {};
});

const HREF_MATCHER_REGX = /#([\S ]+)$/;

const getDefaultTarget = () => window;

const Anchor = React.forwardRef<AffixIntance & HTMLDivElement, AnchorProps>((props, ref) => {
  const {
    affix = true,
    affixTarget = getDefaultTarget,
    scrollTarget = getDefaultTarget,
    offsetBottom,
    offsetTop,
    onChange,
    bounds = 5,
    targetOffset = 0,
    ...others
  } = props;

  const [currentScrollTarget, setCurrentScrollTarget] = React.useState<Window | HTMLElement>();

  const [links, setLinks] = React.useState<Array<string>>([]);

  const [activeLink, setActiveLink] = React.useState('');

  const isScollingRef = React.useRef(false);

  const registerLink = React.useCallback((link: string) => {
    setLinks((prev) => [...prev, link]);
  }, []);

  const unregisterLink = React.useCallback((link: string) => {
    setLinks((prev) => prev.filter((it) => it !== link));
  }, []);

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

    if (activeLinkInfo) {
      setActiveLink(activeLinkInfo.link);
    }
  });

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

  React.useEffect(() => {
    if (!currentScrollTarget) {
      return;
    }

    const throttleHandleScroll = throttleByAnimationFrame(handleScroll);

    throttleHandleScroll();
    on(currentScrollTarget, 'scroll', throttleHandleScroll);
    return () => {
      throttleHandleScroll.cancel?.();
      off(currentScrollTarget, 'scroll', throttleHandleScroll);
    };
  }, [currentScrollTarget, handleScroll]);

  if (affix) {
    return (
      <Affix
        {...others}
        target={affixTarget}
        offsetBottom={offsetBottom}
        offsetTop={offsetTop}
        ref={ref}
      />
    );
  }
  return <div {...others} ref={ref}></div>;
});

if (!env.isProduction) {
  Anchor.displayName = displayName;
  Anchor.propTypes = {};
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
