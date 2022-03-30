import { styled } from '@xl-vision/react';
import { useUnmount } from '@xl-vision/hooks';
import React from 'react';
import { LoadingOutlined } from '@xl-vision/icons';
import { keyframes } from '@xl-vision/styled-engine';
import Sandbox from './Sandbox';

const babelPromise = import('@babel/standalone');

export type PreviewProps = {
  reactVersion?: string;
  libVersion?: string;
  code: string;
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
    const { color, styleSize } = theme;
    return {
      backgroundColor: color.background.paper,
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
          backgroundColor: color.background.paper,
        },
        svg: {
          fontSize: 50,
          color: color.themes.primary.color,
        },
      },
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
  }}
  .loading {
    svg {
      animation: ${loadingKeyframes} 1s linear infinite;
    }
  }
`;

const DEFAULT_EXEC = `
require(['react','react-dom', '@xl-vision/react', 'demo'], function(React,ReactDOM, vision, Demo) {
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

const Preview: React.FunctionComponent<PreviewProps> = (props) => {
  const { code, scripts, reactVersion, libVersion } = props;

  const [parsedCode, setParsedCode] = React.useState('');
  const [error, setError] = React.useState<string>();

  const timerRef = React.useRef<number>();
  const isFirstRef = React.useRef(true);

  const [loading, setLoading] = React.useState(true);

  const builtinDeps = React.useMemo(() => {
    const _reactVersion = reactVersion ? `@${reactVersion}` : '';
    const _libVersion = libVersion ? `@${libVersion}` : '';
    return {
      react: `https://unpkg.com/react${_reactVersion}/umd/react.production.min.js?callback=defined`,
      'react-dom': `https://unpkg.com/react-dom${_reactVersion}/umd/react-dom.production.min.js?callback=defined`,
      '@xl-vision/react': `https://unpkg.com/@xl-vision/react${_libVersion}/dist/index.production.min.js?callback=defined`,
      '@xl-vision/icons': `https://unpkg.com/@xl-vision/icons${_libVersion}/dist/index.production.min.js?callback=defined`,
    };
  }, [reactVersion, libVersion]);

  const allScripts = React.useMemo(() => {
    return {
      ...builtinDeps,
      ...scripts,
    };
  }, [builtinDeps, scripts]);

  React.useEffect(() => {
    setLoading(true);
    const cb = () => {
      babelPromise
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
      const timer = timerRef.current;
      window.clearTimeout(timer);
      timerRef.current = window.setTimeout(cb, 500);
    }
  }, [code]);

  useUnmount(() => {
    window.clearTimeout(timerRef.current);
  });

  const handleLoad = React.useCallback((win: Window) => {
    const onError = (err: Error, info: { componentStack: string }) => {
      setError(`${err.toString()}\n${info.componentStack}`);
    };
    const onLoaded = () => setLoading(false);

    // 防止组件渲染在load触发前
    if ((win as unknown as { $$mounted?: boolean }).$$mounted) {
      onLoaded();
    }

    (win as unknown as { $$onError: any }).$$onError = onError;
    (win as unknown as { $$onLoaded: any }).$$onLoaded = onLoaded;
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
              scripts={allScripts}
              exec={DEFAULT_EXEC}
              onLoad={handleLoad}
            />
          </div>
        )
      )}
    </Root>
  );
};

export default Preview;
