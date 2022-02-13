import { defaultLanguage } from '@xl-vision/react/locale';
import { mount } from 'enzyme';
import React from 'react';
import useConfig from '../useConfig';
import ConfigProvider from '../ConfigProvider';

describe('ConfigProvider', () => {
  it('Get language', () => {
    const fn = jest.fn<any, Array<any>>();

    const Demo = () => {
      const { language, locale } = useConfig();

      React.useEffect(() => {
        fn(language, locale);
      }, [language, locale]);

      return <div />;
    };

    const wrapper = mount(
      <ConfigProvider language='en-US'>
        <Demo />
      </ConfigProvider>,
    );

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe('en-US');

    fn.mockClear();

    wrapper.setProps({
      language: 'zh-CN',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe('zh-CN');
    fn.mockClear();

    wrapper.setProps({
      language: 'aaa',
    });

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toBe(defaultLanguage);
  });
});
