import { defaultLanguage } from '@xl-vision/react/locale';
import { ConfigProvider, useConfig } from '@xl-vision/react';
import { useEffect } from 'react';
import { render } from '@testing-library/react';

describe('ConfigProvider', () => {
  it('Test get language', () => {
    const fn = jest.fn<any, Array<any>>();

    const Demo = () => {
      const { language, locale } = useConfig();

      useEffect(() => {
        fn(language, locale);
      }, [language, locale]);

      return <div />;
    };

    const { rerender } = render(
      <ConfigProvider language='en-US'>
        <Demo />
      </ConfigProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe('en-US');

    fn.mockClear();

    rerender(
      <ConfigProvider language='zh-CN'>
        <Demo />
      </ConfigProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe('zh-CN');
    fn.mockClear();

    rerender(
      <ConfigProvider language='aaa'>
        <Demo />
      </ConfigProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(defaultLanguage);
  });
});
