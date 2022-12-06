import { Button, Popper } from '@xl-vision/react';

const Demo = () => {
  return (
    <Popper
      offset={10}
      popup={
        <Popper offset={10} popup={<div>hello world</div>} trigger='click'>
          <Button color='primary'>click</Button>
        </Popper>
      }
      trigger='click'
    >
      <Button color='primary'>click</Button>
    </Popper>
  );
};

export default Demo;
