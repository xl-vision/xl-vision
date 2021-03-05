import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import Popper from '..';
import wait from '../../../../../test/wait';

// const findPopper = (wrapper: ReactWrapper, popupClass: string) => {
//   return wrapper
//     .findWhere((it) => {
//       const node1 = it.childAt(0);
//       if (!node1.exists()) {
//         return false;
//       }
//       const node2 = node1.childAt(0);
//       if (!node2.exists()) {
//         return false;
//       }
//       const node3 = node2.childAt(0);
//       if (!node3.exists()) {
//         return false;
//       }
//       return node3.hasClass(popupClass);
//     })
//     .first();
// };

describe('Popper', () => {
  let wrapper: ReactWrapper<any, any>;

  beforeAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('test trigger hover', async () => {
    wrapper = mount(
      <Popper trigger='hover' popup={<div className='popup' />}>
        <button id='btn'>button</button>
      </Popper>,
    );

    expect(document.querySelector('#popup')).toBeNull();

    wrapper.find('#btn').simulate('mouseenter');

    await act(() => wait(100));

    const popup = document.querySelector('.popup') as HTMLElement;

    console.log(popup)

    expect(popup.style.display).toBe('');

    wrapper.find('#btn').simulate('mouseleave');

    await act(() => wait(30));

    expect(popup.style.display).toBe('none');
  });
  // it('测试触发条件:click', async () => {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   wrapper = mount(
  //     <Popper trigger='click' popupClassName='popup' popup={<div />}>
  //       <button type='button' className='btn'>
  //         button
  //       </button>
  //     </Popper>,
  //   );

  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();

  //   wrapper.find('.btn').simulate('click');
  //   await act(() => wait(80));

  //   const popup = document.querySelector('.popup') as HTMLElement;
  //   expect(popup.style.display).toBe('');

  //   document.body.click();
  //   await act(() => wait(80));

  //   expect(popup.style.display).toBe('none');
  // });
  // it('测试触发条件:focus', async () => {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   wrapper = mount(
  //     <Popper trigger='focus' popupClassName='popup' popup={<div />}>
  //       <button type='button' className='btn'>
  //         button
  //       </button>
  //     </Popper>,
  //   );

  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();

  //   wrapper.find('.btn').simulate('focus');
  //   await act(() => wait(80));

  //   const popup = document.querySelector('.popup') as HTMLElement;
  //   expect(popup.style.display).toBe('');

  //   wrapper.find('.btn').simulate('blur');
  //   await act(() => wait(80));

  //   expect(popup.style.display).toBe('none');
  // });

  // it('测试触发条件:contextMenu', async () => {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   wrapper = mount(
  //     <Popper trigger='contextMenu' popupClassName='popup' popup={<div />}>
  //       <button type='button' className='btn'>
  //         button
  //       </button>
  //     </Popper>,
  //   );

  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();

  //   wrapper.find('.btn').simulate('contextmenu');
  //   await act(() => wait(80));

  //   const popup = document.querySelector('.popup') as HTMLElement;
  //   expect(popup.style.display).toBe('');

  //   document.body.click();
  //   await act(() => wait(80));

  //   expect(popup.style.display).toBe('none');
  // });
  // it('测试触发条件:custom', async () => {
  //   const CustomPopper = ({ visible }: { visible: boolean }) => {
  //     return (
  //       <Popper trigger='custom' visible={visible} popupClassName='popup' popup={<div />}>
  //         <button type='button' className='btn'>
  //           button
  //         </button>
  //       </Popper>
  //     );
  //   };
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   wrapper = mount(<CustomPopper visible={false} />);

  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();

  //   wrapper.setProps({
  //     visible: true,
  //   });
  //   await act(() => wait(80));

  //   const popup = document.querySelector('.popup') as HTMLElement;
  //   expect(popup.style.display).toBe('');

  //   wrapper.setProps({
  //     visible: false,
  //   });
  //   await act(() => wait(80));

  //   expect(popup.style.display).toBe('none');
  // });
  // it('测试onVisibleChange', async () => {
  //   const handleVisibleChange = jest.fn();
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   wrapper = mount(
  //     <Popper popupClassName='popup' onVisibleChange={handleVisibleChange} popup={<div />}>
  //       <button type='button' className='btn'>
  //         button
  //       </button>
  //     </Popper>,
  //   );
  //   await act(() => wait(80));

  //   wrapper.find('.btn').simulate('mouseenter');
  //   await act(() => wait(80));

  //   expect(handleVisibleChange.mock.calls.length).toBe(1);
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   expect(handleVisibleChange.mock.calls[0][0]).toBe(true);
  //   handleVisibleChange.mockClear();

  //   wrapper.find('.btn').simulate('mouseleave');
  //   await act(() => wait(80));

  //   expect(handleVisibleChange.mock.calls.length).toBe(1);
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //   expect(handleVisibleChange.mock.calls[0][0]).toBe(false);
  // });
  // it('测试弹出框进入行为:disablePopupEnter', async () => {
  //   const CustomPopper = ({ disablePopupEnter }: { disablePopupEnter: boolean }) => {
  //     return (
  //       <Popper disablePopupEnter={disablePopupEnter} popupClassName='popup' popup={<div />}>
  //         <button type='button' className='btn'>
  //           button
  //         </button>
  //       </Popper>
  //     );
  //   };
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   wrapper = mount(<CustomPopper disablePopupEnter={false} />);

  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();

  //   wrapper.find('.btn').simulate('mouseenter');
  //   await act(() => wait(80));
  //   const popup = document.querySelector('.popup') as HTMLElement;
  //   expect(popup.style.display).toBe('');

  //   wrapper.find('.btn').simulate('mouseleave');
  //   await act(() => wait(5));

  //   findPopper(wrapper, 'popup').simulate('mouseenter');
  //   await act(() => wait(80));
  //   expect(popup.style.display).toBe('');

  //   wrapper.setProps({
  //     disablePopupEnter: true,
  //   });

  //   findPopper(wrapper, 'popup').simulate('mouseleave');
  //   await act(() => wait(5));
  //   findPopper(wrapper, 'popup').simulate('mouseenter');
  //   await act(() => wait(80));
  //   expect(popup.style.display).toBe('none');
  // });
  // it('测试弹出框延迟挂载', async () => {
  //   const CustomPopper = ({ forceRender }: { forceRender: boolean }) => {
  //     return (
  //       <Popper forceRender={forceRender} popupClassName='popup' popup={<div />}>
  //         <button type='button' className='btn'>
  //           button
  //         </button>
  //       </Popper>
  //     );
  //   };
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   wrapper = mount(<CustomPopper forceRender={false} />);

  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();

  //   wrapper.find('.btn').simulate('mouseenter');
  //   await act(() => wait(80));
  //   let popup = document.querySelector('.popup') as HTMLElement;
  //   expect(popup.style.display).toBe('');

  //   wrapper.find('.btn').simulate('mouseleave');
  //   await act(() => wait(80));
  //   expect(popup.style.display).toBe('none');

  //   wrapper.unmount();

  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   wrapper = mount(<CustomPopper forceRender={true} />);

  //   await act(() => wait(80));

  //   popup = document.querySelector('.popup') as HTMLElement;

  //   expect(popup.style.display).toBe('none');

  //   wrapper.find('.btn').simulate('mouseenter');
  //   await act(() => wait(80));
  //   expect(popup.style.display).toBe('');

  //   wrapper.find('.btn').simulate('mouseleave');
  //   await act(() => wait(80));
  //   expect(popup.style.display).toBe('none');
  // });

  // it('测试多popper嵌套', async () => {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   wrapper = mount(
  //     <Popper
  //       popupClassName='popup'
  //       popup={
  //         <Popper popupClassName='popup2' popup={<div />}>
  //           <button type='button' className='btn2'>
  //             button
  //           </button>
  //         </Popper>
  //       }
  //     >
  //       <button type='button' className='btn'>
  //         button
  //       </button>
  //     </Popper>,
  //   );

  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();
  //   expect(document.querySelector('.popup2')).toBeNull();

  //   wrapper.find('.btn').simulate('mouseenter');
  //   await act(() => wait(80));
  //   const popup = document.querySelector('.popup') as HTMLElement;
  //   expect(popup.style.display).toBe('');
  //   expect(document.querySelector('.popup2')).toBeNull();

  //   wrapper.find('.btn').simulate('mouseleave');
  //   findPopper(wrapper, 'popup').simulate('mouseenter');
  //   wrapper.find('.btn2').simulate('mouseenter');
  //   await act(() => wait(80));
  //   const popup2 = document.querySelector('.popup2') as HTMLElement;
  //   expect(popup.style.display).toBe('');
  //   expect(popup2.style.display).toBe('');

  //   // btn2 popup2都属于popup
  //   wrapper.find('.btn2').simulate('mouseleave');
  //   findPopper(wrapper, 'popup2').simulate('mouseenter');
  //   await act(() => wait(80));
  //   expect(popup.style.display).toBe('');
  //   expect(popup2.style.display).toBe('');

  //   // TODO: 有时候通过，有时候不通过，原因未知
  //   // findPopper(wrapper, 'popup2').simulate('mouseleave')
  //   // findPopper(wrapper, 'popup').simulate('mouseleave')
  //   // await act(() => wait(80))
  //   // expect(popup.style.display).toBe('none')
  //   // expect(popup2.style.display).toBe('none')
  // });

  // it('测试disabled', async () => {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   wrapper = mount(
  //     <Popper
  //       disabled={true}
  //       popupClassName='popup'
  //       popup={
  //         <Popper visible={true} popupClassName='popup2' popup={<div />}>
  //           <button type='button' className='btn2'>
  //             button
  //           </button>
  //         </Popper>
  //       }
  //     >
  //       <button type='button' className='btn'>
  //         button
  //       </button>
  //     </Popper>,
  //   );

  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();
  //   expect(document.querySelector('.popup2')).toBeNull();

  //   wrapper.find('.btn').simulate('mouseenter');
  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();
  //   expect(document.querySelector('.popup2')).toBeNull();

  //   wrapper.setProps({
  //     trigger: 'click',
  //   });
  //   wrapper.update();
  //   wrapper.find('.btn').simulate('click');
  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();
  //   expect(document.querySelector('.popup2')).toBeNull();

  //   wrapper.setProps({
  //     trigger: 'focus',
  //   });
  //   wrapper.update();
  //   wrapper.find('.btn').simulate('focus');
  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();
  //   expect(document.querySelector('.popup2')).toBeNull();

  //   wrapper.setProps({
  //     trigger: 'contextMenu',
  //   });
  //   wrapper.update();
  //   wrapper.find('.btn').simulate('contextmenu');
  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();
  //   expect(document.querySelector('.popup2')).toBeNull();

  //   wrapper.setProps({
  //     trigger: 'custom',
  //     visible: true,
  //   });
  //   wrapper.update();
  //   await act(() => wait(80));
  //   expect(document.querySelector('.popup')).toBeNull();
  //   expect(document.querySelector('.popup2')).toBeNull();
  // });
});
