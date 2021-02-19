import React from 'react';
import PropTypes from 'prop-types';

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

BaseIcon.displayName = 'BaseIcon';

export default React.memo(BaseIcon);
