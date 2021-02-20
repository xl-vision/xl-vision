import React from 'react';
import PropTypes from 'prop-types';
import { isDevelopment } from '../utils/env';

export interface BaseIconProps extends React.SVGAttributes<SVGSVGElement> {
  children: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
}

const BaseIcon: React.FunctionComponent<BaseIconProps> = React.forwardRef((props, ref) => {
  const { children, ...others } = props;
  return React.cloneElement(children, {
    ...others,
    ref,
  });
});

BaseIcon.propTypes = {
  children: PropTypes.element.isRequired,
};

if (isDevelopment) {
  BaseIcon.displayName = 'BaseIcon';
}

export default React.memo(BaseIcon);
