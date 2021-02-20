import React from 'react';

export default (svg: React.ReactElement, displayName: string) => {
  const Component = React.forwardRef<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>(
    (props, ref) => {
      return React.cloneElement(svg, {
        ...props,
        ref,
      });
    },
  );

  if (process.env.NODE_ENV !== 'production') {
    Component.displayName = displayName;
  }
  return Component;
};
