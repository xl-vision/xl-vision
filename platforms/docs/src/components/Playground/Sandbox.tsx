import { styled } from '@xl-vision/react';
import React from 'react';

export type SandboxProps = {
  code: string;
  exec?: string;
  resources?: Array<string>;
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
  const { code, exec, resources } = props;

  const srcDoc = React.useMemo(() => {
    const headNodes = (resources || [])?.map((it) =>
      /\.css$/.test(it)
        ? `<link type='text/css' rel='stylesheet' href='${it}'></link>`
        : `<script src='${it}'></script>`,
    );

    const tailNodes = [`<script>${code};${exec}</script>`];

    return [...headNodes, `<div id='sandbox'></div>`, ...tailNodes].join('\n');
  }, [code, resources, exec]);

  return <Root srcDoc={srcDoc} />;
};

export default Sandbox;
