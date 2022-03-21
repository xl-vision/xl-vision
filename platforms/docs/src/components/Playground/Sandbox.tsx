import { styled } from '@xl-vision/react';
import React from 'react';

export type SandboxProps = {
  demo: string;
  scripts?: Record<string, string>;
  exec?: string;
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
  const { demo, scripts, exec } = props;

  const srcDoc = React.useMemo(() => {
    return `
<style>
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  -webkit-text-size-adjust: 100%;
}
*, *::before, *::after {
  box-sizing: inherit;
}
</style>
<script src='https://requirejs.org/docs/release/2.3.6/minified/require.js'></script>
<script>
  requirejs.config({
    paths: ${JSON.stringify({
      ...scripts,
      demo: `data:text/javascript;base64,${Buffer.from(demo).toString('base64')}`,
    })},
  })
</script>
<div id='sandbox'></div>
<script>${exec}</script>`;
  }, [demo, scripts, exec]);

  return <Root srcDoc={srcDoc} />;
};

export default Sandbox;
