import React from 'react';
import { useCssTransition } from '@xl-vision/hooks';
import { Button, styled } from '@xl-vision/react';

const Root = styled('div')(() => {
  return {
    '.demo': {
      '&-appear-active, &-disappear-active, &-enter-active, &-leave-active': {
        transition: 'all 2s ease-in-out',
      },
      '&-appear-from, &-disappear-to, &-disappear-done, &-enter-from, &-leave-to, &-leave-done': {
        opacity: 0,
        transform: `translateX(100px)`,
      },
      '&-appear-to, &-appear-done, &-disappear-from, &-enter-to, &-enter-done, &-leave-from': {
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
    transitionClasseNames: 'demo',
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
