import React from 'react';
import { Avatar, Icon, styled } from '@xl-vision/react';
import { UserOutlined } from '@xl-vision/icons';

const Wrapper = styled('div')(() => {
  return {
    '>*': {
      margin: 4,
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
          size={64}
          shape='round'
          icon={
            <Icon>
              <UserOutlined />
            </Icon>
          }
        />
        <Avatar
          size='large'
          shape='round'
          icon={
            <Icon>
              <UserOutlined />
            </Icon>
          }
        />
        <Avatar
          shape='round'
          icon={
            <Icon>
              <UserOutlined />
            </Icon>
          }
        />
        <Avatar
          shape='round'
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
