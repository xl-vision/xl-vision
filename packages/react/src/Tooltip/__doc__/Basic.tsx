import React from 'react';
import { Tooltip, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(() => {
  return {
    marginRight: '100px',
    '.column': {
      display: 'flex',
      justifyContent: 'space-between',
      ':not(:last-child)': {
        marginBottom: '10px',
      },
    },
  };
});

const content = <span>This is content</span>;

export default () => {
  return (
    <Wrapper>
      <div className='column'>
        <div />
        <Tooltip placement='top-start' content={content}>
          <Button>top start</Button>
        </Tooltip>
        <Tooltip placement='top' content={content}>
          <Button>top</Button>
        </Tooltip>
        <Tooltip placement='top-end' content={content}>
          <Button>top end</Button>
        </Tooltip>
        <div />
      </div>
      <div className='column'>
        <Tooltip placement='left-start' content={content}>
          <Button>left start</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip placement='right-start' content={content}>
          <Button>right start</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <Tooltip placement='left' content={content}>
          <Button>left</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip placement='right' content={content}>
          <Button>right</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <Tooltip placement='left-end' content={content}>
          <Button>left end</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip placement='right-end' content={content}>
          <Button>right end</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <div />
        <Tooltip placement='bottom-start' content={content}>
          <Button>bottom start</Button>
        </Tooltip>
        <Tooltip placement='bottom' content={content}>
          <Button>bottom</Button>
        </Tooltip>
        <Tooltip placement='bottom-end' content={content}>
          <Button>bottom end</Button>
        </Tooltip>
        <div />
      </div>
    </Wrapper>
  );
};
