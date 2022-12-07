import { Button, styled } from '@xl-vision/react';
import { useState } from 'react';
import { useCssTransition } from '@xl-vision/hooks';

const Root = styled('div')(() => {
  return {
    '.demo': {
      '&-appear-active, &-disappear-active, &-enter-active, &-exit-active': {
        transition: 'all 2s ease-in-out',
      },
      '&-appear-from, &-disappear-to, &-enter-from, &-exit-to': {
        opacity: 0,
        transform: `translateX(100px)`,
      },
    },
  };
});

const Demo = () => {
  const [inOption, setInOption] = useState(false);

  const { nodeRef: node1Ref, show: show1 } = useCssTransition({
    in: inOption,
    transitionClassName: 'demo',
    transitionOnFirst: true,
  });

  const { nodeRef: node2Ref, show: show2 } = useCssTransition({
    in: inOption,
    transitionClassName: 'demo',
    transitionOnFirst: true,
  });

  return (
    <Root>
      <Button color='primary' onClick={() => setInOption((prev) => !prev)}>
        click
      </Button>
      <div ref={node1Ref} style={{ display: show1 ? '' : 'none' }}>
        always in dom
      </div>
      {show2 && <div ref={node2Ref}>remove when exit</div>}
    </Root>
  );
};

export default Demo;
