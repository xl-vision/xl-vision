import { mount } from 'enzyme';
import React from 'react';
import DeleteFilled from '@xl-vision/icons/DeleteFilled';
import Icon from '../../Icon';
import ThemeProvder, { BaseTheme } from '../../ThemeProvider';

describe('styled', () => {
  it('test styled overrideStyles', () => {
    const Demo = ({ transition }: { transition?: string }) => {
      const theme: BaseTheme = React.useMemo(() => {
        if (!transition) {
          return {};
        }
        return {
          overrideStyles: {
            Icon: {
              Root: {
                transition,
              },
            },
          },
        };
      }, [transition]);
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
      transition: 'none',
    });
    expect(wrapper.render()).toMatchSnapshot();
  });
});
