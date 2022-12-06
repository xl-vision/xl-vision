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
        <Popover autoPlacementOptions={false} content={content} placement='top-start' title='title'>
          <Button color='primary'>TS</Button>
        </Popover>
        <Popover autoPlacementOptions={false} content={content} placement='top' title='title'>
          <Button color='primary'>T</Button>
        </Popover>
        <Popover autoPlacementOptions={false} content={content} placement='top-end' title='title'>
          <Button color='primary'>TE</Button>
        </Popover>
        <div />
      </div>
      <div className='column'>
        <Popover
          autoPlacementOptions={false}
          content={content}
          placement='left-start'
          title='title'
        >
          <Button color='primary'>LS</Button>
        </Popover>
        <div />
        <div />
        <div />
        <Popover
          autoPlacementOptions={false}
          content={content}
          placement='right-start'
          title='title'
        >
          <Button color='primary'>RS</Button>
        </Popover>
      </div>
      <div className='column'>
        <Popover autoPlacementOptions={false} content={content} placement='left' title='title'>
          <Button color='primary'>L</Button>
        </Popover>
        <div />
        <div />
        <div />
        <Popover autoPlacementOptions={false} content={content} placement='right' title='title'>
          <Button color='primary'>R</Button>
        </Popover>
      </div>
      <div className='column'>
        <Popover autoPlacementOptions={false} content={content} placement='left-end' title='title'>
          <Button color='primary'>LE</Button>
        </Popover>
        <div />
        <div />
        <div />
        <Popover autoPlacementOptions={false} content={content} placement='right-end' title='title'>
          <Button color='primary'>RE</Button>
        </Popover>
      </div>
      <div className='column'>
        <div />
        <Popover
          autoPlacementOptions={false}
          content={content}
          placement='bottom-start'
          title='title'
        >
          <Button color='primary'>BS</Button>
        </Popover>
        <Popover autoPlacementOptions={false} content={content} placement='bottom' title='title'>
          <Button color='primary'>B</Button>
        </Popover>
        <Popover
          autoPlacementOptions={false}
          content={content}
          placement='bottom-end'
          title='title'
        >
          <Button color='primary'>BE</Button>
        </Popover>
        <div />
      </div>
    </Wrapper>
  );
};

export default Basic;
