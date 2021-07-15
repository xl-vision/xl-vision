import Avatar from './Avatar';
import AvatarGroup from './AvatarGroup';

export * from './Avatar';
export * from './AvatarGroup';

const AvatarWithGroup = Avatar as typeof Avatar & { Group: typeof AvatarGroup };

AvatarWithGroup.Group = AvatarGroup;

export default AvatarWithGroup;
