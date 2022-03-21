import { styled } from '@xl-vision/react';
import { useUnmount } from '@xl-vision/hooks';
import React from 'react';
import Sandbox from './Sandbox';

export type PreviewProps = {
  reactVersion?: string;
  libVersion?: string;
  code: string;
  scripts?: Record<string, string>;
};

const Root = styled('div')(({ theme }) => {
  const { color, styleSize } = theme;
  return {
    backgroundColor: color.background.paper,
    position: 'relative',
    overflowY: 'auto',
    width: '100%',
    height: '100%',
    '.demo': {
      height: '100%',
    },
    '.error, .demo': {
      padding: `${styleSize.middle.padding.y}px ${styleSize.middle.padding.x}px`,
    },
    '.error': {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      margin: 0,
      backgroundColor: color.themes.error.color,
      color: color.themes.error.text.primary,
      overflow: 'auto',
    },
  };
});

const DEFAULT_EXEC = `
require(['react','react-dom', 'demo'], function(React,ReactDOM, Demo) {
  ReactDOM.render(React.createElement(Demo.default), document.querySelector('#sandbox'))
})
`;

const Preview: React.FunctionComponent<PreviewProps> = (props) => {
  const { code, scripts, reactVersion, libVersion } = props;

  const [parsedCode, setParsedCode] = React.useState('');
  const [error, setError] = React.useState<string>();

  const timerRef = React.useRef<number>();
  const isFirstRef = React.useRef(true);

  const builtinDeps = React.useMemo(() => {
    const _reactVersion = reactVersion ? `@${reactVersion}` : '';
    const _libVersion = libVersion ? `@${libVersion}` : '';
    return {
      react: `https://unpkg.com/react${_reactVersion}/umd/react.development.js?callback=defined`,
      'react-dom': `https://unpkg.com/react-dom${_reactVersion}/umd/react-dom.development.js?callback=defined`,
      '@xl-vision/react': `https://unpkg.com/@xl-vision/react${_libVersion}/dist/index.production.min.js?callback=defined`,
    };
  }, [reactVersion, libVersion]);

  const allScripts = React.useMemo(() => {
    return {
      ...builtinDeps,
      ...scripts,
    };
  }, [builtinDeps, scripts]);

  React.useEffect(() => {
    const cb = () => {
      import('@babel/standalone')
        .then((Babel) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          const result: { code: string } = Babel.transform(code, {
            presets: [
              'react',
              [
                'env',
                {
                  modules: 'umd',
                },
              ],
            ],
          });

          setParsedCode(`${result.code.replace(/^define\(/, 'require(')}`);
          setError('');
        })
        .catch((err) => {
          setParsedCode('');
          setError((err as Error).toString());
        });
    };

    if (isFirstRef.current) {
      // 第一次渲染不延迟
      cb();
      isFirstRef.current = false;
    } else {
      const timer = timerRef.current;
      window.clearTimeout(timer);
      timerRef.current = window.setTimeout(cb, 500);
    }
  }, [code]);

  useUnmount(() => {
    window.clearTimeout(timerRef.current);
  });

  return (
    <Root>
      {error ? (
        <pre className='error'>
          <code>{error}</code>
        </pre>
      ) : (
        parsedCode && (
          <div className='demo'>
            <Sandbox demo={parsedCode} scripts={allScripts} exec={DEFAULT_EXEC} />
          </div>
        )
      )}
    </Root>
  );
};

export default Preview;
