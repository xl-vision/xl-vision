import { CSSObject } from '@xl-vision/styled-engine-types';
import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import useForkRef from '../hooks/useForkRef';
import useResize from '../hooks/useResizeObserver';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';
import useEventCallback from '../hooks/useEventCallback';

export type AvatarShape = 'circle' | 'square' | 'round';
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
})<{ shape: AvatarShape; size?: AvatarSize; isImage: boolean }>(({ theme, styleProps }) => {
  const { shape: shapeType, size, isImage } = styleProps;
  const { color, shape } = theme;
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
    userSelect: 'none',
    '> img': {
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderStyle: 'none',
    },
  };

  if (isImage) {
    style.background = '0 0';
  }

  if (shapeType === 'circle') {
    style.borderRadius = '50%';
  } else if (shapeType === 'round') {
    style.borderRadius = shape.borderRadius.md;
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
    style,
    ...others
  } = props;
  const { clsPrefix } = React.useContext(ThemeContext);

  const nodeRef = React.useRef<HTMLSpanElement>(null);
  const forkRef = useForkRef(nodeRef, ref);

  const [scale, setScale] = React.useState(1);

  const [isImgExist, setImgExist] = React.useState(true);

  const handleResize = useEventCallback(() => {
    const node = nodeRef.current;
    const child = childRef.current;
    if (!node || !child) {
      return;
    }
    const { offsetWidth, offsetHeight } = node;

    const { offsetHeight: childOffsetHeight, offsetWidth: childOffsetWidth } = child;

    const scaleX = (offsetWidth - 2 * gap) / childOffsetWidth;
    const scaleY = (offsetHeight - 2 * gap) / childOffsetHeight;

    if (scaleX <= 0 || scaleY <= 0) {
      return;
    }

    setScale(Math.min(scaleX, scaleY));
  });

  const childResizeRef = useResize<HTMLSpanElement>(handleResize);

  const childRef = React.useRef<HTMLSpanElement>(null);

  const forkChildRef = useForkRef(childResizeRef, childRef);

  React.useEffect(() => {
    handleResize();
  }, [gap, handleResize]);

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
      <AvatarInner ref={forkChildRef} style={childrenStyle}>
        {icon || children}
      </AvatarInner>
    );
  }

  const isImage = (src && isImgExist) || hasImageElement;

  const rootClassName = `${clsPrefix}-button`;

  const rootClasses = clsx(rootClassName, className);

  const rootSizeStyle = React.useMemo(() => {
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
        isImage,
      }}
      style={{
        ...rootSizeStyle,
        ...style,
      }}
      ref={forkRef}
    >
      {childNode}
    </AvatarRoot>
  );
});

if (isDevelopment) {
  Avatar.displayName = displayName;
  Avatar.propTypes = {
    children: PropTypes.node,
    icon: PropTypes.element,
    shape: PropTypes.oneOf<AvatarShape>(['round', 'circle', 'square']),
    size: PropTypes.oneOf<AvatarSize>(['small', 'default', 'large']),
    src: PropTypes.node,
    srcSet: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    gap: PropTypes.number,
    onError: PropTypes.func,
    style: PropTypes.object,
  };
}

export default Avatar;
