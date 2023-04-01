import { useConstantFn, useForkRef } from '@xl-vision/hooks';
import { CSSObject } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  HTMLAttributes,
  ReactElement,
  SVGAttributes,
  ReactNode,
  forwardRef,
  useContext,
  useRef,
  useState,
  useEffect,
  isValidElement,
  useMemo,
  CSSProperties,
} from 'react';
import AvatarContext from './AvatarContext';
import ResizeObserver from '../ResizeObserver';
import { styled } from '../styles';
import { SizeVariant, useTheme } from '../ThemeProvider';

export type AvatarShape = 'circle' | 'square' | 'round';

export type AvatarSize = SizeVariant | number;

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  icon?: ReactElement<SVGAttributes<SVGSVGElement>>;
  shape?: AvatarShape;
  size?: AvatarSize;
  src?: ReactNode;
  gap?: number;
  srcSet?: string;
  alt?: string;
  onError?: () => boolean;
};

const displayName = 'Avatar';

const AvatarRoot = styled('span', {
  name: displayName,
  slot: 'Root',
})<{
  isImage: boolean;
  shape: AvatarShape;
  size: SizeVariant;
}>(({ theme, styleProps }) => {
  const { shape: shapeType, size, isImage } = styleProps;
  const { colors, sizes } = theme;
  const style: CSSObject = {
    position: 'relative',
    display: 'inline-flex',
    boxSizing: 'border-box',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    color: colors.background.paper,
    backgroundColor: colors.text.hint,
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
    style.borderRadius = sizes[size].borderRadius;
  }

  const themeSize = sizes[size];
  style.width = style.height = 32 * themeSize.fontSize;

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

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
  const { size: contextSize, shape: contextShape } = useContext(AvatarContext);
  const { clsPrefix, size: configSize } = useTheme();

  const {
    children,
    icon,
    shape = contextShape || 'circle',
    size = contextSize || configSize,
    src,
    srcSet,
    alt,
    className,
    gap = 4,
    onError,
    style,
    ...others
  } = props;

  const nodeRef = useRef<HTMLSpanElement>(null);
  const forkRef = useForkRef(nodeRef, ref);

  const [scale, setScale] = useState(1);

  const [isImgExist, setImgExist] = useState(true);

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

  const childRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    handleResize();
  }, [gap, handleResize]);

  const handleImgError = useConstantFn(() => {
    const errorFlag = onError?.();
    if (errorFlag !== false) {
      setImgExist(false);
    }
  });

  let childNode: ReactNode;

  const rootClassName = `${clsPrefix}-avatar`;

  const hasImageElement = isValidElement(src);

  const isImage = (src && isImgExist) || hasImageElement;

  const rootClasses = clsx(
    `${rootClassName}--shape-${shape}`,
    {
      [`${rootClassName}--size-${size}`]: typeof size === 'string' && size,
      [`${rootClassName}--has-image`]: isImage,
    },
    className,
  );

  if (typeof src === 'string' && src && isImgExist) {
    childNode = <img alt={alt} src={src} srcSet={srcSet} onError={handleImgError} />;
  } else if (hasImageElement) {
    childNode = src;
  } else if (icon || children) {
    const transformString = `scale(${scale})`;
    const childrenStyle: CSSProperties = {
      msTransform: transformString,
      WebkitTransform: transformString,
      transform: transformString,
    };
    childNode = (
      <ResizeObserver onResizeObserver={handleResize}>
        <AvatarInner ref={childRef} style={childrenStyle}>
          {icon || children}
        </AvatarInner>
      </ResizeObserver>
    );
  }

  const rootSizeStyle = useMemo(() => {
    if (typeof size === 'number') {
      return {
        width: `${size}px`,
        height: `${size}px`,
      };
    }
    return {};
  }, [size]);

  const rootSize = useMemo(() => {
    return (typeof size === 'string' && size) || configSize;
  }, [size, configSize]);

  return (
    <AvatarRoot
      {...others}
      className={rootClasses}
      ref={forkRef}
      style={{
        ...rootSizeStyle,
        ...style,
      }}
      styleProps={{
        shape,
        size: rootSize,
        isImage,
      }}
    >
      {childNode}
    </AvatarRoot>
  );
});

if (!isProduction) {
  Avatar.displayName = displayName;
  Avatar.propTypes = {
    alt: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    gap: PropTypes.number,
    icon: PropTypes.element,
    shape: PropTypes.oneOf<AvatarShape>(['round', 'circle', 'square']),
    size: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.oneOf<SizeVariant>(['small', 'middle', 'large']),
    ]),
    src: PropTypes.node,
    srcSet: PropTypes.string,
    style: PropTypes.shape({}),
    onError: PropTypes.func,
  };
}

export default Avatar;
