import { render } from '@testing-library/react';
import { useMemo } from 'react';
import ThemeProvder, { BaseTheme } from '../../ThemeProvider';
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
        } as BaseTheme;
      }, [color]);
      return (
        <ThemeProvder theme={theme}>
          <Button>click</Button>
        </ThemeProvder>
      );
    };

    const { container, rerender } = render(<Demo />);

    expect(container).toMatchSnapshot();

    rerender(<Demo color='blue' />);

    expect(container).toMatchSnapshot();
  });
});
