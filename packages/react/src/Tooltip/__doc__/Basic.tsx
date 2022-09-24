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
        <Tooltip placement='top-start' content={content} autoPlacementOptions={false}>
          <Button color='primary'>TS</Button>
        </Tooltip>
        <Tooltip placement='top' content={content} autoPlacementOptions={false}>
          <Button color='primary'>T</Button>
        </Tooltip>
        <Tooltip placement='top-end' content={content} autoPlacementOptions={false}>
          <Button color='primary'>TE</Button>
        </Tooltip>
        <div />
      </div>
      <div className='column'>
        <Tooltip placement='left-start' content={content} autoPlacementOptions={false}>
          <Button color='primary'>LS</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip placement='right-start' content={content} autoPlacementOptions={false}>
          <Button color='primary'>RS</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <Tooltip placement='left' content={content} autoPlacementOptions={false}>
          <Button color='primary'>L</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip placement='right' content={content} autoPlacementOptions={false}>
          <Button color='primary'>R</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <Tooltip placement='left-end' content={content} autoPlacementOptions={false}>
          <Button color='primary'>LE</Button>
        </Tooltip>
        <div />
        <div />
        <div />
        <Tooltip placement='right-end' content={content} autoPlacementOptions={false}>
          <Button color='primary'>RE</Button>
        </Tooltip>
      </div>
      <div className='column'>
        <div />
        <Tooltip placement='bottom-start' content={content} autoPlacementOptions={false}>
          <Button color='primary'>BS</Button>
        </Tooltip>
        <Tooltip placement='bottom' content={content} autoPlacementOptions={false}>
          <Button color='primary'>B</Button>
        </Tooltip>
        <Tooltip placement='bottom-end' content={content} autoPlacementOptions={false}>
          <Button color='primary'>BE</Button>
        </Tooltip>
        <div />
      </div>
    </Wrapper>
  );
};

export default Basic;
