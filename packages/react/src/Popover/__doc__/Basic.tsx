import React from 'react';
import { Popover, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(() => {
  return {
    padding: '0 25px',
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
        <Popover placement='top-start' title='title' content={content}>
          <Button theme='primary'>TS</Button>
        </Popover>
        <Popover placement='top' title='title' content={content}>
          <Button theme='primary'>T</Button>
        </Popover>
        <Popover placement='top-end' title='title' content={content}>
          <Button theme='primary'>TE</Button>
        </Popover>
        <div />
      </div>
      <div className='column'>
        <Popover placement='left-start' title='title' content={content}>
          <Button theme='primary'>LS</Button>
        </Popover>
        <div />
        <div />
        <div />
        <Popover placement='right-start' title='title' content={content}>
          <Button theme='primary'>RS</Button>
        </Popover>
      </div>
      <div className='column'>
        <Popover placement='left' title='title' content={content}>
          <Button theme='primary'>L</Button>
        </Popover>
        <div />
        <div />
        <div />
        <Popover placement='right' title='title' content={content}>
          <Button theme='primary'>R</Button>
        </Popover>
      </div>
      <div className='column'>
        <Popover placement='left-end' title='title' content={content}>
          <Button theme='primary'>LE</Button>
        </Popover>
        <div />
        <div />
        <div />
        <Popover placement='right-end' title='title' content={content}>
          <Button theme='primary'>RE</Button>
        </Popover>
      </div>
      <div className='column'>
        <div />
        <Popover placement='bottom-start' title='title' content={content}>
          <Button theme='primary'>BS</Button>
        </Popover>
        <Popover placement='bottom' title='title' content={content}>
          <Button theme='primary'>B</Button>
        </Popover>
        <Popover placement='bottom-end' title='title' content={content}>
          <Button theme='primary'>BE</Button>
        </Popover>
        <div />
      </div>
    </Wrapper>
  );
};
