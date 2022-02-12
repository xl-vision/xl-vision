import React from 'react';
import { Input, styled } from '@xl-vision/react';
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
      <Input placeholder='Basic usage' prefix={<UserOutlined />} />
      <Input
        placeholder='Basic usage'
        suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.2)' }} />}
      />

      <Input style={{ color: 'rgba(0,0,0,0.2)' }} placeholder='Basic usage' suffix='RMB' />
    </Root>
  );
};

export default Demo;
