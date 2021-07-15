/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { Avatar, Icon, styled } from '@xl-vision/react';
import { UserOutlined } from '@xl-vision/icons';
import avatarImg from './avatar.jpg';

const Wrapper = styled('div')(() => {
  return {
    '>*': {
      margin: 4,
    },
  };
});

export default () => {
  return (
    <Wrapper>
      <Avatar
        icon={
          <Icon>
            <UserOutlined />
          </Icon>
        }
      />
      <Avatar>User</Avatar>
      <Avatar src={avatarImg} />
      <Avatar
        style={{ backgroundColor: 'rgb(135, 208, 104)' }}
        icon={
          <Icon>
            <UserOutlined />
          </Icon>
        }
      />
    </Wrapper>
  );
};
