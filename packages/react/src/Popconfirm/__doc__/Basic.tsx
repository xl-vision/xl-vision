import { Popconfirm, Button } from '@xl-vision/react';

const Basic = () => {
  return (
    <div>
      <Popconfirm
        title='Are you sure to do it?'
        onCancel={() => console.log('cancel')}
        onConfirm={() => console.log('confirm')}
      >
        <Button color='primary'>button</Button>
      </Popconfirm>
    </div>
  );
};

export default Basic;
