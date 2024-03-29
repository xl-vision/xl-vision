import { createContext } from 'react';
import { AvatarShape, AvatarSize } from './Avatar';

export type AvatarContextProps = {
  size?: AvatarSize;
  shape?: AvatarShape;
};

export default createContext<AvatarContextProps>({});
