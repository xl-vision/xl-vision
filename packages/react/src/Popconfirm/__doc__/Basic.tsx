import { Popconfirm, Button } from '@xl-vision/react';

const Basic = () => {
  return (
    <div>
      <Popconfirm
        title='Are you sure to do it?'
        onConfirm={() => console.log('confirm')}
        onCancel={() => console.log('cancel')}
      >
        <Button color='primary'>button</Button>
      </Popconfirm>
    </div>
  );
};

export default Basic;
