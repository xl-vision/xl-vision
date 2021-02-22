import React from 'react';
import PropTypes from 'prop-types';
import { isDevelopment } from '../utils/env';

export interface BaseIconProps extends React.SVGAttributes<SVGSVGElement> {
  children: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
}

const BaseIcon = React.forwardRef<SVGSVGElement, BaseIconProps>((props, ref) => {
  const { children, ...others } = props;
  return React.cloneElement(children, {
    ...others,
    ref,
  });
});

if (isDevelopment) {
  BaseIcon.displayName = 'BaseIcon';

  BaseIcon.propTypes = {
    children: PropTypes.element.isRequired,
  };
}

export default React.memo(BaseIcon);
