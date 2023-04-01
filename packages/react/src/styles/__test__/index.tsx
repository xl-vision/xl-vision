import { render } from '@testing-library/react';
import { useMemo } from 'react';
import { ThemeProvider, ThemeInput } from '@xl-vision/react';
import styled from '../styled';

const Button = styled('button', {
  name: 'DemoButton',
  slot: 'Root',
})(() => {
  return {
    color: 'red',
  };
});

describe('styled', () => {
  it('test styled overrideStyles', () => {
    const Demo = ({ color }: { color?: string }) => {
      const theme = useMemo(() => {
        if (!color) {
          return {};
        }
        return {
          overrideStyles: {
            DemoButton: {
              Root: {
                color,
              },
            },
          },
        } as ThemeInput;
      }, [color]);
      return (
        <ThemeProvider {...theme}>
          <Button>click</Button>
        </ThemeProvider>
      );
    };

    const { container, rerender } = render(<Demo />);

    expect(container).toMatchSnapshot();

    rerender(<Demo color='blue' />);

    expect(container).toMatchSnapshot();
  });
});
