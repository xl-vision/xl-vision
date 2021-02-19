import React from 'react';

export default (svg: React.ReactElement, displayName: string) => {
  const Component: React.FunctionComponent<React.SVGAttributes<SVGSVGElement>> = React.forwardRef(
    (props, ref) => {
      return React.cloneElement(svg, {
        ...props,
        ref,
      });
    },
  );

  Component.displayName = displayName;
  return Component;
};
