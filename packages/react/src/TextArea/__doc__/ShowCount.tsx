import { TextArea } from '@xl-vision/react';

const Demo = () => {
  return (
    <div>
      <TextArea
        allowClear={true}
        maxLength={20}
        placeholder='Default one row'
        rows={1}
        showCount={true}
      />
      <TextArea
        allowClear={true}
        maxLength={20}
        placeholder='Default mutiple rows'
        showCount={true}
        style={{ marginTop: 10 }}
      />
    </div>
  );
};

export default Demo;
