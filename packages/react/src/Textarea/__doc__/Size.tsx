import { Textarea } from '@xl-vision/react';

const Demo = () => {
  return (
    <div>
      <Textarea placeholder='Basic usage' size='small' />
      <Textarea placeholder='Basic usage' size='middle' style={{ marginTop: 10 }} />
      <Textarea placeholder='Basic usage' size='large' style={{ marginTop: 10 }} />
    </div>
  );
};

export default Demo;
