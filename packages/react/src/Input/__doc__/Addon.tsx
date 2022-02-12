import React from 'react';
import { Input } from '@xl-vision/react';
import { SettingOutlined } from '@xl-vision/icons';

const Demo = () => {
  return (
    <div>
      <Input
        placeholder='Basic usage'
        defaultValue='xl-vision.8910'
        addonBefore='https://'
        addonAfter='.xyz'
      />
      <Input
        style={{ marginTop: 10 }}
        placeholder='Basic usage'
        defaultValue='xl-vision.8910.xyz'
        addonBefore='https://'
        addonAfter={<SettingOutlined />}
      />
    </div>
  );
};

export default Demo;
