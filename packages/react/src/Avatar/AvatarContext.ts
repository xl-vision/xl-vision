import React from 'react';
import { AvatarShape, AvatarSize } from './Avatar';

export type AvatarContextProps = {
  size?: AvatarSize;
  shape?: AvatarShape;
};

export default React.createContext<AvatarContextProps>({});
