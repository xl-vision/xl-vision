import { Button, Dropdown } from '@xl-vision/react';

const Basic = () => {
  const menus = (
    <>
      <Dropdown.Item onClick={() => console.log(1)}>1st menu item</Dropdown.Item>
      <Dropdown.Item disabled={true} onClick={() => console.log(2)}>
        2nd menu item
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={() => console.log(3)}>3rd menu item</Dropdown.Item>
    </>
  );

  return (
    <Dropdown menus={menus}>
      <Button color='primary'>button</Button>
    </Dropdown>
  );
};

export default Basic;
