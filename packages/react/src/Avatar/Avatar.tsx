import { CSSObject } from '@xl-vision/styled-engine-types';
import clsx from 'clsx';
import React from 'react';
import useForkRef from '../hooks/useForkRef';
import useResize, { ResizeObserverHandler } from '../hooks/useResizeObserver';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';

export type AvatarShape = 'circle' | 'square';
export type AvatarSize = 'small' | 'default' | 'large';

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  icon?: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
  shape?: AvatarShape;
  size?: number | AvatarSize;
  src?: React.ReactNode;
  gap?: number;
  srcSet?: string;
  alt?: string;
  onError?: () => boolean;
};

const displayName = 'Avatar';

const AvatarRoot = styled('span', {
  name: displayName,
  slot: 'Root',
})<{ shape: AvatarShape; size?: AvatarSize }>(({ theme, styleProps }) => {
  const { shape, size } = styleProps;
  const { color } = theme;
  const style: CSSObject = {
    position: 'relative',
    display: 'inline-flex',
    boxSizing: 'border-box',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    color: color.background.paper,
    backgroundColor: color.text.icon,
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (shape === 'circle') {
    style.borderRadius = '50%';
  }

  if (size) {
    const sizeNumber = size === 'large' ? 40 : size === 'default' ? 32 : 24;
    style.width = sizeNumber;
    style.height = sizeNumber;
  }

  return style;
});

const AvatarInner = styled('span', {
  name: displayName,
  slot: 'Inner',
})(({ theme }) => {
  const { typography } = theme;
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.baseFontSize,
  };
});

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
  const {
    children,
    icon,
    shape = 'circle',
    size = 'default',
    src,
    srcSet,
    alt,
    className,
    gap = 4,
    onError,
    ...others
  } = props;
  const { clsPrefix } = React.useContext(ThemeContext);

  const childRef = React.useRef<HTMLSpanElement>(null);

  const [scale, setScale] = React.useState(1);

  const [isImgExist, setImgExist] = React.useState(true);

  const handleResize: ResizeObserverHandler<HTMLSpanElement> = React.useCallback(
    (_, target) => {
      const childEl = childRef.current;
      if (!childEl) {
        return;
      }
      const { offsetWidth, offsetHeight } = target;

      const { offsetHeight: childOffsetHeight, offsetWidth: childOffsetWidth } = childEl;

      const scaleX = (offsetWidth - 2 * gap) / childOffsetWidth;
      const scaleY = (offsetHeight - 2 * gap) / childOffsetHeight;

      if (scaleX <= 0 || scaleY <= 0) {
        return;
      }

      setScale(Math.min(scaleX, scaleY));
    },
    [gap],
  );

  const nodeRef = useResize<HTMLSpanElement>(handleResize);

  const forkRef = useForkRef(nodeRef, ref);

  const handleImgError = React.useCallback(() => {
    const errorFlag = onError?.();
    if (errorFlag !== false) {
      setImgExist(false);
    }
  }, [onError]);

  let childNode: React.ReactNode;

  const hasImageElement = React.isValidElement(src);

  if (typeof src === 'string' && isImgExist) {
    childNode = <img src={src} srcSet={srcSet} alt={alt} onError={handleImgError} />;
  } else if (hasImageElement) {
    childNode = src;
  } else if (icon || children) {
    const transformString = `scale(${scale})`;
    const childrenStyle: React.CSSProperties = {
      msTransform: transformString,
      WebkitTransform: transformString,
      transform: transformString,
    };
    childNode = (
      <AvatarInner ref={childRef} style={childrenStyle}>
        {icon || children}
      </AvatarInner>
    );
  }

  const rootClassName = `${clsPrefix}-button`;

  const rootClasses = clsx(rootClassName, className);

  const rootStyle = React.useMemo(() => {
    if (typeof size === 'number') {
      return {
        width: `${size}px`,
        height: `${size}px`,
      };
    }
    return {};
  }, [size]);

  const rootSize = React.useMemo(() => {
    return (typeof size === 'string' && size) as AvatarSize;
  }, [size]);

  return (
    <AvatarRoot
      {...others}
      className={rootClasses}
      styleProps={{
        shape,
        size: rootSize,
      }}
      style={rootStyle}
      ref={forkRef}
    >
      {childNode}
    </AvatarRoot>
  );
});

if (isDevelopment) {
  Avatar.displayName = displayName;
  Avatar.propTypes = {};
}

export default Avatar;
