import { render } from '@testing-library/react';
import { useEffect } from 'react';
import { ThemeInput, ThemeProvider, useTheme } from '@xl-vision/react';
import { enUS, zhCN } from '@xl-vision/react/locale';

describe('ThemeProvider', () => {
  it('Test swicth locale', () => {
    const fn = jest.fn<any, Array<any>>();

    const Demo = () => {
      const { locale } = useTheme();

      useEffect(() => {
        fn(locale);
      }, [locale]);

      return <div />;
    };

    const { rerender } = render(
      <ThemeProvider locale={enUS}>
        <Demo />
      </ThemeProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toStrictEqual(enUS);

    fn.mockClear();

    rerender(
      <ThemeProvider locale={zhCN}>
        <Demo />
      </ThemeProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toStrictEqual(zhCN);
    fn.mockClear();
  });

  it('Test swicth clsPrefix', () => {
    const fn = jest.fn<any, Array<any>>();

    const Demo = () => {
      const { clsPrefix } = useTheme();

      useEffect(() => {
        fn(clsPrefix);
      }, [clsPrefix]);

      return <div />;
    };

    const { rerender } = render(
      <ThemeProvider clsPrefix='a'>
        <Demo />
      </ThemeProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe('a');

    fn.mockClear();

    rerender(
      <ThemeProvider clsPrefix='b'>
        <Demo />
      </ThemeProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe('b');
    fn.mockClear();
  });

  it('Test swicth size', () => {
    const fn = jest.fn<any, Array<any>>();

    const Demo = () => {
      const { sizeVariant } = useTheme();

      useEffect(() => {
        fn(sizeVariant);
      }, [sizeVariant]);

      return <div />;
    };

    const { rerender } = render(
      <ThemeProvider sizeVariant='small'>
        <Demo />
      </ThemeProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe('small');

    fn.mockClear();

    rerender(
      <ThemeProvider sizeVariant='large'>
        <Demo />
      </ThemeProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe('large');
    fn.mockClear();
  });

  it('test theme prop override', () => {
    const theme1: ThemeInput = {
      breakpoints: {
        unit: 'px',
      },
    };

    const theme2: ThemeInput = {
      breakpoints: {
        unit: 'rem',
      },
    };

    const Demo1 = () => {
      const theme = useTheme();

      expect(theme.breakpoints.unit).toBe('px');
      return <div />;
    };

    const Demo2 = () => {
      const theme = useTheme();

      expect(theme.breakpoints.unit).toBe('rem');
      return <div />;
    };

    render(
      <ThemeProvider {...theme1}>
        <Demo1 />
        <ThemeProvider {...theme2}>
          <Demo2 />
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect.assertions(2);
  });
});
