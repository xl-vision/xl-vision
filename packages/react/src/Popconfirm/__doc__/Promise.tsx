import { Popconfirm, Button } from '@xl-vision/react';
import { useState, useCallback } from 'react';

const Promise = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleConfirm = useCallback(() => {
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
