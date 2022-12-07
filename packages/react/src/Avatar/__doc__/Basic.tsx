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
        <Avatar icon={<UserOutlined />} size={64} />
        <Avatar icon={<UserOutlined />} size='large' />
        <Avatar icon={<UserOutlined />} size='middle' />
        <Avatar icon={<UserOutlined />} size='small' />
      </Wrapper>
      <Wrapper>
        <Avatar icon={<UserOutlined />} shape='round' size={64} />
        <Avatar icon={<UserOutlined />} shape='round' size='large' />
        <Avatar icon={<UserOutlined />} shape='round' size='middle' />
        <Avatar icon={<UserOutlined />} shape='round' size='small' />
      </Wrapper>
      <Wrapper>
        <Avatar icon={<UserOutlined />} shape='square' size={64} />
        <Avatar icon={<UserOutlined />} shape='square' size='large' />
        <Avatar icon={<UserOutlined />} shape='square' size='middle' />
        <Avatar icon={<UserOutlined />} shape='square' size='small' />
      </Wrapper>
    </>
  );
};

export default Basic;
