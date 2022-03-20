import { styled } from '@xl-vision/react';
import { useUnmount } from '@xl-vision/hooks';
import React from 'react';
import Sandbox from './Sandbox';

export type PreviewProps = {
  code: string;
  exec?: string;
  resources?: Array<string>;
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

const Preview: React.FunctionComponent<PreviewProps> = (props) => {
  const { code, exec, resources } = props;

  const [parsedCode, setParsedCode] = React.useState('');
  const [error, setError] = React.useState<string>();

  const timerRef = React.useRef<number>();
  const isFirstRef = React.useRef(true);

  React.useEffect(() => {
    const cb = () => {
      import('@babel/standalone')
        .then((Babel) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          const result: { code: string } = Babel.transform(code, {
            presets: [
              [
                'env',
                {
                  modules: 'umd',
                },
              ],
              'react',
            ],
            filename: 'Demo',
          });

          setParsedCode(result.code);
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
            <Sandbox code={parsedCode} resources={resources} exec={exec} />
          </div>
        )
      )}
    </Root>
  );
};

export default Preview;
