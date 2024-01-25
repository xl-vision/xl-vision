'use client';

import { useState } from 'react';
import { Button, Input } from '@xl-vision/react';

const { Group } = Input;

const Demo = () => {
  const [value, handleValue] = useState<string>();

  return (
    <div>
      <Group size='small'>
        <Input addonBefore='URL' placeholder='Basic usage' value={value} onChange={handleValue} />
        <Button color='primary'>search</Button>
      </Group>
      <Group size='middle' style={{ marginTop: 10 }}>
        <Input addonBefore='URL' placeholder='Basic usage' value={value} onChange={handleValue} />
        <Button color='primary'>search</Button>
      </Group>
      <Group size='large' style={{ marginTop: 10 }}>
        <Input addonBefore='URL' placeholder='Basic usage' value={value} onChange={handleValue} />
        <Button color='primary'>search</Button>
      </Group>
    </div>
  );
};

export default Demo;
