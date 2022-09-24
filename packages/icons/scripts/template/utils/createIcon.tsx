import { isProduction } from '@xl-vision/utils';
import { forwardRef, ReactElement, SVGProps } from 'react';
import BaseIcon from './BaseIcon';

const createIcon = (svg: ReactElement<SVGProps<SVGSVGElement>>, displayName?: string) => {
  const cloneComponent = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => {
    return (
      <BaseIcon {...props} ref={ref}>
        {svg}
      </BaseIcon>
    );
  });

  if (!isProduction && displayName) {
    cloneComponent.displayName = displayName;
  }
  return cloneComponent;
};

export default createIcon;
