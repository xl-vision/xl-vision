import React from 'react';
import { Popconfirm, Button } from '@xl-vision/react';

const Promise = () => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const handleConfirm = React.useCallback(() => {
    setConfirmLoading(true);
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  }, []);

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  return (
    <div>
      <Popconfirm
        title='Are you sure to do it?'
        visible={visible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        confirmButtonProps={{ loading: confirmLoading }}
      >
        <Button color='primary' onClick={() => setVisible(true)}>
          button
        </Button>
      </Popconfirm>
    </div>
  );
};

export default Promise;
