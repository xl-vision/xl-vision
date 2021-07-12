import React from 'react';
import { isDevelopment } from '../utils/env';

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement> & {};

const displayName = 'AvatarGroup';

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>((props, ref) => {
  const {} = props;
  return <div ref={ref}>Avatar</div>;
});

if (isDevelopment) {
  AvatarGroup.displayName = displayName;
  AvatarGroup.propTypes = {};
}

export default AvatarGroup;
