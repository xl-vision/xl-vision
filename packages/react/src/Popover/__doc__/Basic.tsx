import React from 'react';
import { Popover, Button, styled } from '@xl-vision/react';

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

const Basic = () => {
  return (
    <Wrapper>
      <div className='column'>
        <div />
        <Popover placement='top-start' title='title' content={content} flip={false}>
          <Button color='primary'>TS</Button>
        </Popover>
        <Popover placement='top' title='title' content={content} flip={false}>
          <Button color='primary'>T</Button>
        </Popover>
        <Popover placement='top-end' title='title' content={content} flip={false}>
          <Button color='primary'>TE</Button>
        </Popover>
        <div />
      </div>
      <div className='column'>
        <Popover placement='left-start' title='title' content={content} flip={false}>
          <Button color='primary'>LS</Button>
        </Popover>
        <div />
        <div />
        <div />
        <Popover placement='right-start' title='title' content={content} flip={false}>
          <Button color='primary'>RS</Button>
        </Popover>
      </div>
      <div className='column'>
        <Popover placement='left' title='title' content={content} flip={false}>
          <Button color='primary'>L</Button>
        </Popover>
        <div />
        <div />
        <div />
        <Popover placement='right' title='title' content={content} flip={false}>
          <Button color='primary'>R</Button>
        </Popover>
      </div>
      <div className='column'>
        <Popover placement='left-end' title='title' content={content} flip={false}>
          <Button color='primary'>LE</Button>
        </Popover>
        <div />
        <div />
        <div />
        <Popover placement='right-end' title='title' content={content} flip={false}>
          <Button color='primary'>RE</Button>
        </Popover>
      </div>
      <div className='column'>
        <div />
        <Popover placement='bottom-start' title='title' content={content} flip={false}>
          <Button color='primary'>BS</Button>
        </Popover>
        <Popover placement='bottom' title='title' content={content} flip={false}>
          <Button color='primary'>B</Button>
        </Popover>
        <Popover placement='bottom-end' title='title' content={content} flip={false}>
          <Button color='primary'>BE</Button>
        </Popover>
        <div />
      </div>
    </Wrapper>
  );
};

export default Basic;
