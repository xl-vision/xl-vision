import { LoadingOutlined } from '@xl-vision/icons';
import { styled } from '@xl-vision/react';
import { keyframes } from '@xl-vision/styled-engine';
import { FC, useState, useRef, useMemo, useEffect, useCallback } from 'react';
import Sandbox from './Sandbox';

const babelPromise = import('@babel/standalone');

export type PreviewProps = {
  code: string;
  libVersion?: string;
  reactVersion?: string;
  scripts?: Record<string, string>;
};

const loadingKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Root = styled('div')`
  ${({ theme }) => {
    const { colors, sizes } = theme;
    return {
      backgroundColor: colors.background.paper,
      position: 'relative',
      overflowY: 'auto',
      width: '100%',
      height: '100%',
      '.loading': {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ':before': {
          content: '" "',
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          opacity: 0.5,
          backgroundColor: colors.background.paper,
        },
        svg: {
          fontSize: 50,
          color: colors.themes.primary.foreground.default,
        },
      },
      '.demo': {
        height: '100%',
      },
      '.error, .demo': {
        padding: `${sizes.middle.padding.y}px ${sizes.middle.padding.x}px`,
      },
      '.error': {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        margin: 0,
        backgroundColor: colors.themes.error.foreground.default,
        color: colors.themes.error.text.primary,
        overflow: 'auto',
      },
    };
  }}
  .loading {
    svg {
      animation: ${loadingKeyframes} 1s linear infinite;
    }
  }
`;

const DEFAULT_EXEC = `
require(['react','react-dom', '@xl-vision/react', 'demo'], function(React, ReactDOM, vision, Demo) {
  // 拦截错误和加载完成事件
  class Wrapper extends React.Component {
    componentDidMount() {
      window.$$onLoaded && window.$$onLoaded();
      window.$$mounted = true
    }

    componentWillUnmount() {
      window.$$mounted = false
    }

    componentDidCatch(error, errorInfo) {
      window.$$onError && window.$$onError(error, errorInfo);
    }

    render() {
      var demo = React.createElement(Demo.default);
      var CssBaseline = vision.CssBaseline;
      var css = React.createElement(CssBaseline, {
        children: demo
      });
      return css
    }
  }

  ReactDOM.render(React.createElement(Wrapper), document.querySelector('#sandbox'))
})
`;

const Preview: FC<PreviewProps> = (props) => {
  const { code, scripts, reactVersion, libVersion } = props;

  const [parsedCode, setParsedCode] = useState('');
  const [error, setError] = useState<string>();

  const timerRef = useRef<number>(null);
  const isFirstRef = useRef(true);

  const [loading, setLoading] = useState(true);

  const builtinDeps = useMemo(() => {
    const _reactVersion = reactVersion ? `@${reactVersion}` : '';
    const _libVersion = libVersion ? `@${libVersion}` : '';
    return {
      react: `https://unpkg.com/react${_reactVersion}/umd/react.production.min.js?callback=defined`,
      'react-dom': `https://unpkg.com/react-dom${_reactVersion}/umd/react-dom.production.min.js?callback=defined`,
      '@xl-vision/react': `https://unpkg.com/@xl-vision/react${_libVersion}/dist/index.production.min.js?callback=defined`,
      '@xl-vision/icons': `https://unpkg.com/@xl-vision/icons${_libVersion}/dist/index.production.min.js?callback=defined`,
      '@xl-vision/hooks': `https://unpkg.com/@xl-vision/hooks${_libVersion}/dist/index.production.min.js?callback=defined`,
    };
  }, [reactVersion, libVersion]);

  const allScripts = useMemo(() => {
    return {
      ...builtinDeps,
      ...scripts,
    };
  }, [builtinDeps, scripts]);

  useEffect(() => {
    setLoading(true);
    const cb = () => {
      babelPromise
        .then((Babel) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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

          setParsedCode((prev) => {
            const current = result.code;
            if (prev === current) {
              setLoading(false);
            }
            return current;
          });
          setError('');
        })
        .catch((err) => {
          setLoading(false);
          setParsedCode('');
          setError((err as Error).toString());
        });
    };

    if (isFirstRef.current) {
      // 第一次渲染不延迟
      cb();
      isFirstRef.current = false;
    } else {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(cb, 500);
    }
  }, [code]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleLoad = useCallback((win: Window) => {
    const onError = (err: Error, info: { componentStack: string }) => {
      setError(`${err.toString()}\n${info.componentStack}`);
    };
    const onLoaded = () => setLoading(false);

    // 防止组件渲染在load触发前
    if ((win as unknown as { $$mounted?: boolean }).$$mounted) {
      onLoaded();
    }

    (win as unknown as { $$onError: typeof onError }).$$onError = onError;
    (win as unknown as { $$onLoaded: typeof onLoaded }).$$onLoaded = onLoaded;
  }, []);

  return (
    <Root>
      {loading && (
        <div className='loading'>
          <LoadingOutlined />
        </div>
      )}
      {error ? (
        <pre className='error'>
          <code>{error}</code>
        </pre>
      ) : (
        parsedCode && (
          <div className='demo'>
            <Sandbox
              demo={parsedCode}
              exec={DEFAULT_EXEC}
              scripts={allScripts}
              onLoad={handleLoad}
            />
          </div>
        )
      )}
    </Root>
  );
};

export default Preview;
