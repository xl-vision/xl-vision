import { TextArea } from '@xl-vision/react';

const Demo = () => {
  return (
    <div>
      <TextArea
        placeholder='Default one row'
        rows={1}
        maxLength={20}
        allowClear={true}
        showCount={true}
      />
      <TextArea
        placeholder='Default mutiple rows'
        allowClear={true}
        maxLength={20}
        showCount={true}
        style={{ marginTop: 10 }}
      />
    </div>
  );
};

export default Demo;
