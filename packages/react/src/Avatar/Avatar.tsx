import { CSSObject } from '@xl-vision/styled-engine';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { env } from '@xl-vision/utils';
import { useConstantFn, useForkRef, useResizeObserver } from '@xl-vision/hooks';
import React from 'react';
import { styled } from '../styles';
import AvatarContext from './AvatarContext';
import { ComponentSize, useTheme } from '../ThemeProvider';

export type AvatarShape = 'circle' | 'square' | 'round';

export type AvatarSize = ComponentSize | number;

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  icon?: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
  shape?: AvatarShape;
  size?: AvatarSize;
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
})<{ shape: AvatarShape; size?: ComponentSize; isImage: boolean }>(({ theme, styleProps }) => {
  const { shape: shapeType, size, isImage } = styleProps;
  const { color, styleSize } = theme;
  const style: CSSObject = {
    position: 'relative',
    display: 'inline-flex',
    boxSizing: 'border-box',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    color: color.background.paper,
    backgroundColor: color.mode === 'light' ? color.grey['400'] : color.grey['600'],
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
    style.borderRadius = styleSize[size || 'middle'].borderRadius;
  }

  if (size) {
    const themeSize = styleSize[size];
    style.width = style.height = 32 * themeSize.fontSize;
  }

  return style;
});

const AvatarInner = styled('span', {
  name: displayName,
  slot: 'Inner',
})(() => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  };
});

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
  const { size: contextSize, shape: contextShape } = React.useContext(AvatarContext);
  const { clsPrefix, componentSize } = useTheme();

  const {
    children,
    icon,
    shape = contextShape || 'circle',
    size = contextSize || componentSize,
    src,
    srcSet,
    alt,
    className,
    gap = 4,
    onError,
    style,
    ...others
  } = props;

  const nodeRef = React.useRef<HTMLSpanElement>(null);
  const forkRef = useForkRef(nodeRef, ref);

  const [scale, setScale] = React.useState(1);

  const [isImgExist, setImgExist] = React.useState(true);

  const handleResize = useConstantFn(() => {
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

  const childResizeRef = useResizeObserver<HTMLSpanElement>(handleResize);

  const childRef = React.useRef<HTMLSpanElement>(null);

  const forkChildRef = useForkRef(childResizeRef, childRef);

  React.useEffect(() => {
    handleResize();
  }, [gap, handleResize]);

  const handleImgError = useConstantFn(() => {
    const errorFlag = onError?.();
    if (errorFlag !== false) {
      setImgExist(false);
    }
  });

  let childNode: React.ReactNode;

  const rootClassName = `${clsPrefix}-avatar`;

  const hasImageElement = React.isValidElement(src);

  const isImage = (src && isImgExist) || hasImageElement;

  const rootClasses = clsx(
    rootClassName,
    `${rootClassName}--shape-${shape}`,
    {
      [`${rootClassName}--size-${size}`]: typeof size === 'string' && size,
      [`${rootClassName}--has-image`]: isImage,
    },
    className,
  );

  if (typeof src === 'string' && src && isImgExist) {
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
      <AvatarInner ref={forkChildRef} style={childrenStyle} className={`${rootClassName}__inner`}>
        {icon || children}
      </AvatarInner>
    );
  }

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
    return (typeof size === 'string' && size) as ComponentSize;
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

if (!env.isProduction) {
  Avatar.displayName = displayName;
  Avatar.propTypes = {
    children: PropTypes.node,
    icon: PropTypes.element,
    shape: PropTypes.oneOf<AvatarShape>(['round', 'circle', 'square']),
    size: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.oneOf<ComponentSize>(['small', 'middle', 'large']),
    ]),
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
