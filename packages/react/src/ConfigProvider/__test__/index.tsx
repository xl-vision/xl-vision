import { render } from '@testing-library/react';
import { useEffect } from 'react';
import { ConfigProvider, useConfig } from '@xl-vision/react';
import { enUS, zhCN } from '@xl-vision/react/locale';

describe('ConfigProvider', () => {
  it('Test swicth locale', () => {
    const fn = jest.fn<any, Array<any>>();

    const Demo = () => {
      const { locale } = useConfig();

      useEffect(() => {
        fn(locale);
      }, [locale]);

      return <div />;
    };

    const { rerender } = render(
      <ConfigProvider locale={enUS}>
        <Demo />
      </ConfigProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(enUS);

    fn.mockClear();

    rerender(
      <ConfigProvider locale={zhCN}>
        <Demo />
      </ConfigProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(zhCN);
    fn.mockClear();
  });
});
