import { styled } from '@xl-vision/react';
import dynamic from 'next/dynamic';
import { FC, useState, useEffect } from 'react';
import Preview from './Preview';

const Editor = dynamic(() => import('./Editor'), { ssr: false });

export type PlaygroundProps = {
  code: string;
  scripts?: Record<string, string>;
};

const Root = styled('div')(({ theme }) => {
  const { colors } = theme;
  return {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    '.editor': {
      width: '50%',
      borderRight: `1px solid ${colors.divider.primary}`,
    },
    '.preview': {
      width: '50%',
      backgroundColor: colors.background.paper,
    },
  };
});

const Playground: FC<PlaygroundProps> = (props) => {
  const { code: codeProp, scripts } = props;

  const [code, handleChange] = useState('');

  useEffect(() => {
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
