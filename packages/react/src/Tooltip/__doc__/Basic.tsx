import React from 'react';
import { Tooltip, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(() => {
  return {
    '.column': {
      display: 'flex',
      justifyContent: 'space-between',
      ':not(:last-child)': {
        marginBottom: '10px',
      },
    },
  };
});

const content = <span>msg</span>;

export default () => {
  return (
    <Wrapper>
      <div className='column'>
        <div />
        <Tooltip placement='top-start' content={content} flip={false}>
          <Button theme='primary'>TS</Button>
        </Tooltip>
        <Tooltip placement='top' content={content} flip={false}>
          <Button theme='primary'>T</Button>
        </Tooltip>
        <Tooltip placement='top-end' content={content} flip={false}>
          <Button theme='primary'>TE</Button>
        </Tooltip>
        <div />
      </div>
      <div className='column'>
        <Tooltip placement='left-start' content={content} flip={false}>
          <Button theme='primary'>LS</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip placement='right-start' content={content} flip={false}>
          <Button theme='primary'>RS</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <Tooltip placement='left' content={content} flip={false}>
          <Button theme='primary'>L</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip placement='right' content={content} flip={false}>
          <Button theme='primary'>R</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <Tooltip placement='left-end' content={content} flip={false}>
          <Button theme='primary'>LE</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip placement='right-end' content={content} flip={false}>
          <Button theme='primary'>RE</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <div />
        <Tooltip placement='bottom-start' content={content} flip={false}>
          <Button theme='primary'>BS</Button>
        </Tooltip>
        <Tooltip placement='bottom' content={content} flip={false}>
          <Button theme='primary'>B</Button>
        </Tooltip>
        <Tooltip placement='bottom-end' content={content} flip={false}>
          <Button theme='primary'>BE</Button>
        </Tooltip>
        <div />
      </div>
    </Wrapper>
  );
};
