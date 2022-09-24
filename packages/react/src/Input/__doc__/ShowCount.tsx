import { Input } from '@xl-vision/react';

const Demo = () => {
  return (
    <div>
      <Input placeholder='Basic usage' maxLength={20} showCount={true} />
      <Input placeholder='Basic usage' showCount={true} style={{ marginTop: 20 }} />
    </div>
  );
};

export default Demo;
