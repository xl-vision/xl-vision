'use client';

import { Popconfirm, Button, Message } from '@xl-vision/react';

const Basic = () => {
  const [message, holder] = Message.useMessage();

  return (
    <div>
      {holder}
      <Popconfirm
        title='Are you sure to do it?'
        onCancel={() => message.info('cancel')}
        onConfirm={() => message.info('confirm')}
      >
        <Button color='primary'>button</Button>
      </Popconfirm>
    </div>
  );
};

export default Basic;
