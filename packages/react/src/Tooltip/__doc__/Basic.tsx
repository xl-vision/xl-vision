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

const Basic = () => {
  return (
    <Wrapper>
      <div className='column'>
        <div />
        <Tooltip autoPlacementOptions={false} content={content} placement='top-start'>
          <Button color='primary'>TS</Button>
        </Tooltip>
        <Tooltip autoPlacementOptions={false} content={content} placement='top'>
          <Button color='primary'>T</Button>
        </Tooltip>
        <Tooltip autoPlacementOptions={false} content={content} placement='top-end'>
          <Button color='primary'>TE</Button>
        </Tooltip>
        <div />
      </div>
      <div className='column'>
        <Tooltip autoPlacementOptions={false} content={content} placement='left-start'>
          <Button color='primary'>LS</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip autoPlacementOptions={false} content={content} placement='right-start'>
          <Button color='primary'>RS</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <Tooltip autoPlacementOptions={false} content={content} placement='left'>
          <Button color='primary'>L</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip autoPlacementOptions={false} content={content} placement='right'>
          <Button color='primary'>R</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <Tooltip autoPlacementOptions={false} content={content} placement='left-end'>
          <Button color='primary'>LE</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip autoPlacementOptions={false} content={content} placement='right-end'>
          <Button color='primary'>RE</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <div />
        <Tooltip autoPlacementOptions={false} content={content} placement='bottom-start'>
          <Button color='primary'>BS</Button>
        </Tooltip>
        <Tooltip autoPlacementOptions={false} content={content} placement='bottom'>
          <Button color='primary'>B</Button>
        </Tooltip>
        <Tooltip autoPlacementOptions={false} content={content} placement='bottom-end'>
          <Button color='primary'>BE</Button>
        </Tooltip>
        <div />
      </div>
    </Wrapper>
  );
};

export default Basic;
