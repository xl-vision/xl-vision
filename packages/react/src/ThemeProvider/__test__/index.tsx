import { mount } from 'enzyme';
import { BaseTheme } from '..';
import ThemeProvider from '../ThemeProvider';
import useTheme from '../useTheme';

describe('ThemeProvider', () => {
  it('test theme prop override', () => {
    const theme1: BaseTheme = {
      clsPrefix: 'cls1-',
      color: {
        mode: 'dark',
      },
    };

    const theme2: BaseTheme = {
      clsPrefix: 'cls2-',
    };

    const Demo1 = () => {
      const theme = useTheme();

      expect(theme.color.mode).toBe('dark');
      expect(theme.clsPrefix).toBe('cls1-');
      return <div />;
    };

    const Demo2 = () => {
      const theme = useTheme();

      expect(theme.color.mode).toBe('dark');
      expect(theme.clsPrefix).toBe('cls2-');
      return <div />;
    };

    mount(
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
