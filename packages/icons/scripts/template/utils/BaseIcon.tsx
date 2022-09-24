import clsx from 'clsx';
import { isProduction } from '@xl-vision/utils';
import { styled } from '@xl-vision/styled-engine';
import { forwardRef, ReactElement, SVGProps, cloneElement } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  children: ReactElement<SVGProps<SVGSVGElement>>;
}

const InnerIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  const { children, className, ...others } = props;

  const classes = clsx('xl-base-icon', className);

  return cloneElement(children, {
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

if (!isProduction) {
  BaseIcon.displayName = 'BaseIcon';
}

export default BaseIcon;
