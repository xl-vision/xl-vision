import { Button, Popper } from '@xl-vision/react';

const Demo = () => {
  return (
    <Popper
      offset={10}
      trigger='click'
      popup={
        <Popper trigger='click' offset={10} popup={<div>hello world</div>}>
          <Button color='primary'>click</Button>
        </Popper>
      }
    >
      <Button color='primary'>click</Button>
    </Popper>
  );
};

export default Demo;
