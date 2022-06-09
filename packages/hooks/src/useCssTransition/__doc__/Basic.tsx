import React from 'react';
import { useCssTransition } from '@xl-vision/hooks';
import { Button, styled } from '@xl-vision/react';

const Root = styled('div')(() => {
  return {
    '.demo': {
      '&-appear-active, &-disappear-active, &-enter-active, &-exit-active': {
        transition: 'all 2s ease-in-out',
      },
      '&-appear, &-disappear-to, &-enter, &-exit-to': {
        opacity: 0,
        transform: `translateX(100px)`,
      },
      '&-appear-to, &-disappear, &-enter-to, &-exit': {
        opacity: 1,
        transform: `translateX(0px)`,
      },
    },
  };
});

const Demo = () => {
  const [show, setShow] = React.useState(true);

  const { activeClassName, nodeRef } = useCssTransition({
    in: show,
    transitionClasseName: 'demo',
    transitionOnFirst: true,
  });

  React.useEffect(() => {
    console.log(activeClassName);
  }, [activeClassName]);

  return (
    <Root>
      <Button color='primary' onClick={() => setShow((prev) => !prev)}>
        click
      </Button>
      <div className={activeClassName} ref={nodeRef}>
        hello
      </div>
    </Root>
  );
};

export default Demo;
