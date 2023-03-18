import { render } from '@testing-library/react';
import { BaseTheme } from '..';
import ThemeProvider from '../ThemeProvider';
import useTheme from '../useTheme';

describe('ThemeProvider', () => {
  it('test theme prop override', () => {
    const theme1: BaseTheme = {
      color: {
        mode: 'dark',
      },
      breakpoints: {
        unit: 'px',
      },
    };

    const theme2: BaseTheme = {
      breakpoints: {
        unit: 'rem',
      },
    };

    const Demo1 = () => {
      const theme = useTheme();

      expect(theme.color.mode).toBe('dark');
      expect(theme.breakpoints.unit).toBe('px');
      return <div />;
    };

    const Demo2 = () => {
      const theme = useTheme();

      expect(theme.color.mode).toBe('dark');
      expect(theme.breakpoints.unit).toBe('rem');
      return <div />;
    };

    render(
      <ThemeProvider theme={theme1}>
        <Demo1 />
        <ThemeProvider theme={theme2}>
          <Demo2 />
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect.assertions(4);
  });
});
