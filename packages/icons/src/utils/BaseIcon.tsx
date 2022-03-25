import React from 'react';
import clsx from 'clsx';
import { env } from '@xl-vision/utils';
import { styled } from '@xl-vision/styled-engine';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

const InnerIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  const { children, className, ...others } = props;

  const classes = clsx('xl-base-icon', className);

  return React.cloneElement(children, {
    ...others,
    className: classes,
    ref,
  });
});

const BaseIcon = styled(InnerIcon)(() => {
  return {
    userSelect: 'none',
    width: '1em',
    height: '1em',
    display: 'inline-block',
    fill: 'currentcolor',
    flexShrink: 0,
  };
});

if (!env.isProduction) {
  BaseIcon.displayName = 'BaseIcon';
}

export default BaseIcon;
