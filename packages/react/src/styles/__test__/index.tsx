import { mount } from 'enzyme';
import React from 'react';
import DeleteFilled from '@xl-vision/icons/DeleteFilled';
import Icon from '../../Icon';
import ThemeProvder, { BaseTheme } from '../../ThemeProvider';

describe('styled', () => {
  it('test styled overrideStyles', () => {
    const Demo = ({ background }: { background?: string }) => {
      const theme: BaseTheme = React.useMemo(() => {
        if (!background) {
          return {};
        }
        return {
          overrideStyles: {
            Icon: {
              Root: {
                background,
              },
            },
          },
        };
      }, [background]);
      return (
        <ThemeProvder theme={theme}>
          <Icon>
            <DeleteFilled />
          </Icon>
        </ThemeProvder>
      );
    };

    const wrapper = mount(<Demo />);

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({
      background: 'red',
    });
    expect(wrapper.render()).toMatchSnapshot();
  });
});
