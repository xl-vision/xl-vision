'use client';

import { Button, Dropdown, Message } from '@xl-vision/react';

const Basic = () => {
  const [message, holder] = Message.useMessage();

  const menus = (
    <>
      <Dropdown.Item onClick={() => message.info('1st menu item')}>1st menu item</Dropdown.Item>
      <Dropdown.Item disabled={true} onClick={() => message.info('2nd menu item')}>
        2nd menu item
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={() => message.info('3rd menu item')}>3rd menu item</Dropdown.Item>
    </>
  );

  return (
    <>
      {holder}
      <Dropdown menus={menus}>
        <Button color='primary'>button</Button>
      </Dropdown>
    </>
  );
};

export default Basic;
