import React from 'react';

export default (svg: React.ReactElement<React.SVGProps<SVGSVGElement>>, displayName: string) => {
  const Component = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
    return React.cloneElement(svg, {
      ...props,
      ref,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    Component.displayName = displayName;
  }
  return Component;
};
