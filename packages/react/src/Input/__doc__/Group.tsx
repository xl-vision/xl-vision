import React from 'react';
import { Button, Input } from '@xl-vision/react';

const { Group } = Input;

const Demo = () => {
  const [value, handleValue] = React.useState<string>();

  return (
    <div>
      <Group size='small'>
        <Input placeholder='Basic usage' value={value} onChange={handleValue} addonBefore='URL' />
        <Button color='primary'>search</Button>
      </Group>
      <Group size='middle' style={{ marginTop: 10 }}>
        <Input placeholder='Basic usage' value={value} onChange={handleValue} addonBefore='URL' />
        <Button color='primary'>search</Button>
      </Group>
      <Group size='large' style={{ marginTop: 10 }}>
        <Input placeholder='Basic usage' value={value} onChange={handleValue} addonBefore='URL' />
        <Button color='primary'>search</Button>
      </Group>
    </div>
  );
};

export default Demo;
