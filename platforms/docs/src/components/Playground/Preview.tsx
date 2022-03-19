import * as xlVisionReact from '@xl-vision/react';
// import * as xlVisionIcon from '@xl-vision/icons';
import { useUnmount } from '@xl-vision/hooks';
import React from 'react';
import evalCode from './evalCode';

export type PreviewProps = {
  value: string;
};

const Root = xlVisionReact.styled('div')(({ theme }) => {
  const { color, styleSize } = theme;
  return {
    backgroundColor: color.background.paper,
    position: 'relative',
    overflowY: 'auto',
    width: '100%',
    height: '100%',
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

const Preview: React.FunctionComponent<PreviewProps> = (props) => {
  const { value } = props;

  const [parsedCode, setParsedCode] = React.useState<string>();
  const [error, setError] = React.useState<string>();

  const timerRef = React.useRef<number>();
  const isFirstRef = React.useRef(true);

  React.useEffect(() => {
    const cb = () => {
      import('@babel/standalone')
        .then((Babel) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          const result: { code: string } = Babel.transform(value, {
            presets: [
              [
                'env',
                {
                  modules: 'auto',
                },
              ],
              'react',
            ],
          });

          setParsedCode(result.code);
          setError('');
        })
        .catch((err) => {
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
  }, [value]);

  useUnmount(() => {
    window.clearTimeout(timerRef.current);
  });

  const demoInstance = React.useMemo(() => {
    if (!parsedCode) {
      return null;
    }
    try {
      const Component = evalCode<React.ComponentType>(
        `var exports={};${parsedCode};return exports.default`,
        {
          React,
          // '@xl-vision/react': xlVisionReact,
          // '@xl-vision/icon': xlVisionIcon,
        },
      );

      const demo = React.createElement(Component);

      return demo;
    } catch (err) {
      console.error(err);
      setError((err as Error).toString());
    }
  }, [parsedCode]);

  return (
    <Root>
      {error ? (
        <pre className='error'>
          <code>{error}</code>
        </pre>
      ) : (
        <div className='demo'>{demoInstance}</div>
      )}
    </Root>
  );
};

export default Preview;
