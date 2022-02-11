import React from 'react';
import { Icon, Input, styled } from '@xl-vision/react';
import { SearchOutlined, UserOutlined } from '@xl-vision/icons';

const Root = styled('div')(() => {
  return {
    '.xl-input': {
      marginBottom: 10,
    },
  };
});

const Demo = () => {
  return (
    <Root>
      <Input
        placeholder='Basic usage'
        prefix={
          <Icon>
            <UserOutlined />
          </Icon>
        }
      />
      <Input
        placeholder='Basic usage'
        suffix={
          <Icon style={{ color: 'rgba(0,0,0,0.2)' }}>
            <SearchOutlined />
          </Icon>
        }
      />

      <Input style={{ color: 'rgba(0,0,0,0.2)' }} placeholder='Basic usage' suffix='RMB' />
    </Root>
  );
};

export default Demo;
