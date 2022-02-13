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
        <Avatar size='middle' icon={<UserOutlined />} />
        <Avatar size='small' icon={<UserOutlined />} />
      </Wrapper>
      <Wrapper>
        <Avatar size={64} shape='round' icon={<UserOutlined />} />
        <Avatar size='large' shape='round' icon={<UserOutlined />} />
        <Avatar size='middle' shape='round' icon={<UserOutlined />} />
        <Avatar size='small' shape='round' icon={<UserOutlined />} />
      </Wrapper>
      <Wrapper>
        <Avatar size={64} shape='square' icon={<UserOutlined />} />
        <Avatar size='large' shape='square' icon={<UserOutlined />} />
        <Avatar size='middle' shape='square' icon={<UserOutlined />} />
        <Avatar size='small' shape='square' icon={<UserOutlined />} />
      </Wrapper>
    </>
  );
};

export default Basic;
