import { CSSObject } from '@xl-vision/styled-engine-types';
import React from 'react';
import { styled } from '../styles';
import { isDevelopment } from '../utils/env';

export type AvatarShape = 'circle' | 'square';
export type AvatarSize = 'small' | 'default' | 'large';

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  icon?: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
  shape?: AvatarShape;
  size?: number | AvatarSize;
  src?: string;
};

const displayName = 'Avatar';

const AvatarRoot = styled('span')<{ shape: AvatarShape; size?: AvatarSize }>(
  ({ theme, styleProps }) => {
    const { shape, size } = styleProps;
    const { color } = theme;
    const style: CSSObject = {
      display: 'inline-block',
      boxSizing: 'border-box',
      textAlign: 'center',
      verticalAlign: 'middle',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      color: color.background.paper,
      backgroundColor: color.text.icon,
    };

    if (shape === 'circle') {
      style.borderRadius = '50%';
    }

    if (size) {
      const sizeNumber = size === 'large' ? 40 : size === 'default' ? 32 : 24;
      style.width = sizeNumber;
      style.height = sizeNumber;
      style.lineHeight = `${sizeNumber}px`;
    }

    return style;
  },
);

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
  const { children, icon, shape = 'circle', size = 'default', src, ...others } = props;

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
      styleProps={{
        shape,
        size: rootSize,
      }}
      style={rootStyle}
      ref={ref}
    >
      <span>Avatar</span>
    </AvatarRoot>
  );
});

if (isDevelopment) {
  Avatar.displayName = displayName;
  Avatar.propTypes = {};
}

export default Avatar;
