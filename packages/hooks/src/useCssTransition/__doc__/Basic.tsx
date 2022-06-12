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
    },
  };
});

const Demo = () => {
  const [inOption, setInOption] = React.useState(false);

  const { activeClassName, nodeRef, show } = useCssTransition({
    in: inOption,
    transitionClassName: 'demo',
    transitionOnFirst: true,
  });

  return (
    <Root>
      <Button color='primary' onClick={() => setInOption((prev) => !prev)}>
        click
      </Button>
      <div className={activeClassName} ref={nodeRef} style={{ display: show ? '' : 'none' }}>
        always in dom
      </div>
      {show && (
        <div className={activeClassName} ref={nodeRef}>
          remove when exit
        </div>
      )}
    </Root>
  );
};

export default Demo;
