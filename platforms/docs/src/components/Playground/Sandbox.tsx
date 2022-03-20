import { styled } from '@xl-vision/react';
import React from 'react';

export type SandboxProps = {
  code: string;
  scripts?: Record<string, string>;
};

const Root = styled('iframe')(() => {
  return {
    margin: 0,
    outline: 0,
    border: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
  };
});

const Sandbox: React.FunctionComponent<SandboxProps> = (props) => {
  const { code, scripts } = props;

  const srcDoc = React.useMemo(() => {
    const tailNodes = [`<script>${code}</script>`];

    return [
      `<script src='https://requirejs.org/docs/release/2.3.6/minified/require.js'></script>`,
      `<script>
        requirejs.config({
          paths: ${JSON.stringify(scripts)}
        })
      </script>`,
      `<div id='sandbox'></div>`,
      ...tailNodes,
    ].join('\n');
  }, [code, scripts]);

  return <Root srcDoc={srcDoc} />;
};

export default Sandbox;
