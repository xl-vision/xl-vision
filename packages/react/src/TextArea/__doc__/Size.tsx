import { TextArea } from '@xl-vision/react';

const Demo = () => {
  return (
    <div>
      <TextArea placeholder='Basic usage' size='small' />
      <TextArea placeholder='Basic usage' size='middle' style={{ marginTop: 10 }} />
      <TextArea placeholder='Basic usage' size='large' style={{ marginTop: 10 }} />
    </div>
  );
};

export default Demo;
