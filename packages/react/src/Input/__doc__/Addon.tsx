import { SettingOutlined } from '@xl-vision/icons';
import { Input } from '@xl-vision/react';

const Demo = () => {
  return (
    <div>
      <Input
        addonAfter='.xyz'
        addonBefore='https://'
        defaultValue='xl-vision.8910'
        placeholder='Basic usage'
      />
      <Input
        addonAfter={<SettingOutlined />}
        addonBefore='https://'
        defaultValue='xl-vision.8910.xyz'
        placeholder='Basic usage'
        style={{ marginTop: 10 }}
      />
    </div>
  );
};

export default Demo;
