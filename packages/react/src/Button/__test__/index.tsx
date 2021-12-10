import React from 'react';
import { mount } from 'enzyme';
import { CloseCircleFilled } from '@xl-vision/icons';
import Button from '..';
import Icon from '../../Icon';

const CloseWrapper = (
  <Icon>
    <CloseCircleFilled />
  </Icon>
);

describe('Button', () => {
  it('test basic render', () => {
    const wrapper = mount(
      <div>
        <Button>button</Button>
        <Button color='error'>button</Button>
        <Button variant='outlined'>button</Button>
        <Button prefixIcon={CloseWrapper}>button</Button>
        <Button suffixIcon={CloseWrapper}>button</Button>
        <Button prefixIcon={CloseWrapper} />
        <Button suffixIcon={CloseWrapper} />
        <Button long={true}>button</Button>
        <Button loading={true}>button</Button>
        <Button loading={true} prefixIcon={CloseWrapper} />
        <Button loading={true} prefixIcon={CloseWrapper}>
          button
        </Button>
      </div>,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('test click', () => {
    const handleClick = jest.fn();
    const wrapper = mount(<Button onClick={handleClick}>button</Button>);

    wrapper.simulate('click');

    expect(handleClick.mock.calls.length).toBe(1);

    wrapper.setProps({
      disabled: true,
    });

    wrapper.simulate('click');

    expect(handleClick.mock.calls.length).toBe(1);

    wrapper.setProps({
      loading: true,
    });

    wrapper.simulate('click');

    expect(handleClick.mock.calls.length).toBe(1);
  });
});

// describe('ButtonGroup', () => {
//   it('基本测试', () => {
//     const wrapper = mount(
//       <Button.Group theme='primary' variant='contained'>
//         <Button>button</Button>
//         <Button theme='error'>button</Button>
//         <Button variant='outlined'>button</Button>
//         <Button prefixIcon={CloseWrapper}>button</Button>
//         <Button suffixIcon={CloseWrapper}>button</Button>
//         <Button prefixIcon={CloseWrapper} />
//         <Button suffixIcon={CloseWrapper} />
//         <Button loading={true}>button</Button>
//         <Button loading={true} prefixIcon={CloseWrapper} />
//         <Button loading={true} prefixIcon={CloseWrapper}>
//           button
//         </Button>
//       </Button.Group>,
//     );

//     expect(wrapper.render()).toMatchSnapshot();

//     wrapper.setProps({
//       size: 'large',
//     });
//     wrapper.update();
//     expect(wrapper.render()).toMatchSnapshot();

//     wrapper.setProps({
//       size: 'small',
//     });
//     wrapper.update();
//     expect(wrapper.render()).toMatchSnapshot();
//   });

//   it('垂直方向', () => {
//     const wrapper = mount(
//       <Button.Group theme='primary' variant='contained' direction='vertical'>
//         <Button>button</Button>
//         <Button theme='error'>button</Button>
//         <Button variant='outlined'>button</Button>
//         <Button prefixIcon={CloseWrapper}>button</Button>
//         <Button suffixIcon={CloseWrapper}>button</Button>
//         <Button prefixIcon={CloseWrapper} />
//         <Button suffixIcon={CloseWrapper} />
//         <Button loading={true}>button</Button>
//         <Button loading={true} prefixIcon={CloseWrapper} />
//         <Button loading={true} prefixIcon={CloseWrapper}>
//           button
//         </Button>
//       </Button.Group>,
//     );

//     expect(wrapper.render()).toMatchSnapshot();

//     wrapper.setProps({
//       size: 'large',
//     });
//     wrapper.update();
//     expect(wrapper.render()).toMatchSnapshot();

//     wrapper.setProps({
//       size: 'small',
//     });
//     wrapper.update();
//     expect(wrapper.render()).toMatchSnapshot();
//   });
// });
