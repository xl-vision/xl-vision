import { SearchOutlined, UserOutlined } from '@xl-vision/icons';
import { Input, styled } from '@xl-vision/react';

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

      <Input placeholder='Basic usage' style={{ color: 'rgba(0,0,0,0.2)' }} suffix='RMB' />
    </Root>
  );
};

export default Demo;
