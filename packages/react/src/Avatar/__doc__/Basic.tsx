import React from 'react';
import { Avatar, Icon } from '@xl-vision/react';
import { UserOutlined } from '@xl-vision/icons';
import { styled } from '@xl-vision/react/styles';

const Wrapper = styled('div')(() => {
  return {
    '>*': {
      margin: 8,
    },
  };
});

export default () => {
  return (
    <>
      <Wrapper>
        <Avatar
          size={64}
          icon={
            <Icon>
              <UserOutlined />
            </Icon>
          }
        />
        <Avatar
          size='large'
          icon={
            <Icon>
              <UserOutlined />
            </Icon>
          }
        />
        <Avatar
          icon={
            <Icon>
              <UserOutlined />
            </Icon>
          }
        />
        <Avatar
          size='small'
          icon={
            <Icon>
              <UserOutlined />
            </Icon>
          }
        />
      </Wrapper>
      <Wrapper>
        <Avatar
          shape='square'
          size={64}
          icon={
            <Icon>
              <UserOutlined />
            </Icon>
          }
        />
        <Avatar
          shape='square'
          size='large'
          icon={
            <Icon>
              <UserOutlined />
            </Icon>
          }
        />
        <Avatar
          shape='square'
          icon={
            <Icon>
              <UserOutlined />
            </Icon>
          }
        />
        <Avatar
          shape='square'
          size='small'
          icon={
            <Icon>
              <UserOutlined />
            </Icon>
          }
        />
      </Wrapper>
    </>
  );
};
