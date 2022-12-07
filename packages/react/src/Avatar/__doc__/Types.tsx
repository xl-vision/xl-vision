import { Avatar, styled } from '@xl-vision/react';
import { UserOutlined } from '@xl-vision/icons';
import avatarImg from './avatar.jpg';

const Wrapper = styled('div')(() => {
  return {
    '>*': {
      margin: 4,
    },
  };
});

const Types = () => {
  return (
    <Wrapper>
      <Avatar icon={<UserOutlined />} />
      <Avatar>User</Avatar>
      <Avatar src={avatarImg.src} />
      <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'rgb(135, 208, 104)' }} />
    </Wrapper>
  );
};

export default Types;
