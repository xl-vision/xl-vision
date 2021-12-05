import React from 'react';
import { env } from '@xl-vision/utils';

const createIcon = (
  svg: React.ReactElement<React.SVGProps<SVGSVGElement>>,
  displayName: string,
) => {
  const Component = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
    return React.cloneElement(svg, {
      ...props,
      ref,
    });
  });

  if (!env.isProduction) {
    Component.displayName = displayName;
  }
  return Component;
};

export default createIcon;
