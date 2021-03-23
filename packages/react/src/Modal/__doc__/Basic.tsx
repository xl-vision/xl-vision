import React from 'react';
import { Button, Modal } from '@xl-vision/react';


export default () => {

  const [visible, setVisible] = React.useState(false)

  return <>
    <Button>show</Button>
    <Modal visible={visible} ></Modal>
  </>
}
