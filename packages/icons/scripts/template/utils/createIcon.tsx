import React from 'react';
import { env } from '@xl-vision/utils';
import BaseIcon from './BaseIcon';

const createIcon = (
  svg: React.ReactElement<React.SVGProps<SVGSVGElement>>,
  displayName: string,
) => {
  const cloneComponent = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
    (props, ref) => {
      return (
        <BaseIcon {...props} ref={ref}>
          {svg}
        </BaseIcon>
      );
    },
  );

  if (!env.isProduction) {
    cloneComponent.displayName = displayName;
  }
  return cloneComponent;
};

export default createIcon;
