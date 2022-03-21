import { styled } from '@xl-vision/react';
import dynamic from 'next/dynamic';
import React from 'react';
import Preview from './Preview';

const Editor = dynamic(() => import('./Editor'), { ssr: false });

export type PlaygroundProps = {
  code: string;
  scripts?: Record<string, string>;
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
  const { code: codeProp, scripts } = props;

  const [code, handleChange] = React.useState('');

  React.useEffect(() => {
    handleChange(codeProp);
  }, [codeProp]);

  return (
    <Root>
      <div className='editor'>
        <Editor value={code} onChange={handleChange} />
      </div>
      <div className='preview'>
        <Preview code={code} scripts={scripts} />
      </div>
    </Root>
  );
};

export default Playground;
