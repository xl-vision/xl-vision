import { styled } from '@xl-vision/react';
import dynamic from 'next/dynamic';
import React from 'react';
import Preview from './Preview';

const Editor = dynamic(() => import('./Editor'), { ssr: false });

export type PlaygroundProps = {
  defaultCode: string;
};

const Root = styled('div')(({ theme }) => {
  const { color } = theme;
  return {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    '.editor': {
      width: '50%',
      borderRight: `1px solid ${color.divider}`,
    },
    '.preview': {
      width: '50%',
      backgroundColor: color.background.paper,
    },
  };
});

const Playground: React.FunctionComponent<PlaygroundProps> = (props) => {
  const { defaultCode } = props;

  const [code, handleChange] = React.useState(defaultCode);

  return (
    <Root>
      <div className='editor'>
        <Editor value={code} onChange={handleChange} />
      </div>
      <div className='preview'>
        <Preview value={code} />
      </div>
    </Root>
  );
};

export default Playground;
