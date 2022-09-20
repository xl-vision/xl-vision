import { mount } from 'enzyme';
import { useMemo } from 'react';
import { DeleteFilled } from '@xl-vision/icons';
import ThemeProvder, { BaseTheme } from '../../ThemeProvider';

describe('styled', () => {
  it('test styled overrideStyles', () => {
    const Demo = ({ transition }: { transition?: string }) => {
      const theme: BaseTheme = useMemo(() => {
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
          <DeleteFilled />
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
