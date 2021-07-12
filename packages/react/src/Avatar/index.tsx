import Avatar from './Avatar';
import AvatarGroup from './AvatarGroup';

export * from './Avatar';
export * from './AvatarGroup';

const AvatarWithGroup = Avatar as typeof Avatar & { group: any };

AvatarWithGroup.group = AvatarGroup;

export default AvatarWithGroup;
