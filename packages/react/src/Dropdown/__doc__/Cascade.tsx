/* eslint-disable no-console */
import { Button, Dropdown } from '@xl-vision/react';
import React from 'react';

export default () => {
  const menus2 = (
    <>
      <Dropdown.Item onClick={() => console.log(3)}>3rd menu item</Dropdown.Item>
      <Dropdown.Item disabled={true} onClick={() => console.log(4)}>
        4th menu item
      </Dropdown.Item>
    </>
  );

  const menus = (
    <>
      <Dropdown.Item onClick={() => console.log(1)}>1st menu item</Dropdown.Item>
      <Dropdown.Item disabled={true} onClick={() => console.log(2)}>
        2nd menu item
      </Dropdown.Item>
      <Dropdown menus={menus2}>
        <Dropdown.Item onClick={() => console.log('submenu')}>submenu</Dropdown.Item>
      </Dropdown>

      <Dropdown.Item onClick={() => console.log(5)}>5thrd menu item</Dropdown.Item>
    </>
  );

  return (
    <Dropdown menus={menus}>
      <Button theme='primary'>button</Button>
    </Dropdown>
  );
};
