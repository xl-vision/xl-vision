import React from 'react';
import { Avatar, styled } from '@xl-vision/react';
import { UserOutlined } from '@xl-vision/icons';

const Wrapper = styled('div')(() => {
  return {
    '>*': {
      margin: 4,
    },
  };
});

const Basic = () => {
  return (
    <>
      <Wrapper>
        <Avatar size={64} icon={<UserOutlined />} />
        <Avatar size='large' icon={<UserOutlined />} />
        <Avatar icon={<UserOutlined />} />
        <Avatar size='small' icon={<UserOutlined />} />
      </Wrapper>
      <Wrapper>
        <Avatar size={64} shape='round' icon={<UserOutlined />} />
        <Avatar size='large' shape='round' icon={<UserOutlined />} />
        <Avatar shape='round' icon={<UserOutlined />} />
        <Avatar shape='round' size='small' icon={<UserOutlined />} />
      </Wrapper>
      <Wrapper>
        <Avatar shape='square' size={64} icon={<UserOutlined />} />
        <Avatar shape='square' size='large' icon={<UserOutlined />} />
        <Avatar shape='square' icon={<UserOutlined />} />
        <Avatar shape='square' size='small' icon={<UserOutlined />} />
      </Wrapper>
    </>
  );
};

export default Basic;
