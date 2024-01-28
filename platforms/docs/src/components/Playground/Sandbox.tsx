import { useConstantFn } from '@xl-vision/hooks';
import { styled } from '@xl-vision/react';
import { FC, useRef, useMemo } from 'react';

export type SandboxProps = {
  demo: string;
  exec?: string;
  onLoad?: (win: Window) => void;
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

const Sandbox: FC<SandboxProps> = (props) => {
  const { demo, scripts, exec, onLoad } = props;
  const ref = useRef<HTMLIFrameElement>(null);

  const srcDoc = useMemo(() => {
    // TODO [2024-07-01]: styled components在iframe中全局样式不生效
    return `
<style>
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  -webkit-text-size-adjust: 100%;
}
body {
  margin: 0;
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

  const handleLoad = useConstantFn(() => {
    const iframe = ref.current;
    if (!iframe) {
      return;
    }

    const win = iframe.contentWindow!;

    onLoad?.(win);
  });

  return <Root ref={ref} srcDoc={srcDoc} onLoad={handleLoad} />;
};

export default Sandbox;
