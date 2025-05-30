import { useConstantFn } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
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
  useImperativeHandle,
} from 'react';
import { flushSync } from 'react-dom';
import AvatarContext from './AvatarContext';
import memoStyled, { ThemeStyleVariant } from '../memoStyled';
import ResizeObserver from '../ResizeObserver';
import { SizeVariant, useTheme } from '../ThemeProvider';
import { RefInstance } from '../types';

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

export type AvatarInstance = RefInstance<HTMLSpanElement>;

const displayName = 'Avatar';

const AvatarRoot = memoStyled('span', {
  name: displayName,
  slot: 'Root',
})<{
  hasImage: boolean;
  shape: AvatarShape;
  size: SizeVariant;
}>(({ theme }) => {
  const { colors, sizes } = theme;
  return {
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
    variants: [
      {
        props: {
          hasImage: true,
        },
        style: {
          background: '0 0',
        },
      },
      {
        props: {
          shape: 'circle',
        },
        style: {
          borderRadius: '50%',
        },
      },
      ...Object.keys(sizes).flatMap<
        ThemeStyleVariant<{
          hasImage: boolean;
          shape: AvatarShape;
          size: SizeVariant;
        }>
      >((k) => {
        const key = k as SizeVariant;
        const themeSize = sizes[key];
        return [
          {
            props: {
              size: key,
            },
            style: {
              width: 32 * themeSize.fontSize,
              height: 32 * themeSize.fontSize,
            },
            variants: [
              {
                props: {
                  shape: 'round',
                },
                style: {
                  borderRadius: themeSize.borderRadius,
                },
              },
            ],
          },
        ];
      }),
    ],
  };
});

const AvatarInner = memoStyled('span', {
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

const Avatar = forwardRef<AvatarInstance, AvatarProps>((props, ref) => {
  const { size: contextSize, shape: contextShape } = useContext(AvatarContext);
  const { sizeVariant } = useTheme();

  const {
    children,
    icon,
    shape = contextShape || 'circle',
    size = contextSize || sizeVariant,
    src,
    srcSet,
    alt,
    gap = 4,
    onError,
    style,
    ...others
  } = props;

  const rootRef = useRef<HTMLSpanElement>(null);

  const [scale, setScale] = useState(1);

  const [isImgExist, setImgExist] = useState(true);

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        return rootRef.current;
      },
    };
  }, []);

  const handleResize = useConstantFn(() => {
    const node = rootRef.current;
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

    flushSync(() => {
      setScale(Math.min(scaleX, scaleY));
    });
  });

  const childRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    Promise.resolve()
      .then(() => {
        handleResize();
      })
      .catch(console.error);
  }, [gap, handleResize]);

  const handleImgError = useConstantFn(() => {
    const errorFlag = onError?.();
    if (errorFlag !== false) {
      setImgExist(false);
    }
  });

  let childNode: ReactNode;

  const hasImageElement = isValidElement(src);

  const hasImage = (src && isImgExist) || hasImageElement;

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
    return (typeof size === 'string' && size) || sizeVariant;
  }, [size, sizeVariant]);

  return (
    <AvatarRoot
      {...others}
      ref={rootRef}
      style={{
        ...rootSizeStyle,
        ...style,
      }}
      styleProps={{
        shape,
        size: rootSize,
        hasImage,
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
