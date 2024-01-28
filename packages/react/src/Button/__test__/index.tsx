import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CloseCircleFilled } from '@xl-vision/icons';
import { Button, SizeVariant, ThemeProvider } from '@xl-vision/react';

const CloseWrapper = <CloseCircleFilled />;

describe('Button', () => {
  it('Test basic render', () => {
    const { container } = render(
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

    expect(container).toMatchSnapshot();
  });

  it('Test click', async () => {
    const handleClick = jest.fn();
    const { container, rerender } = render(<Button onClick={handleClick}>button</Button>);

    const el = container.querySelector('button')!;

    const user = userEvent.setup();

    await user.click(el);

    expect(handleClick.mock.calls.length).toBe(1);
    handleClick.mockClear();

    rerender(
      <Button disabled={true} onClick={handleClick}>
        button
      </Button>,
    );

    await user.click(el);

    expect(handleClick.mock.calls.length).toBe(0);
    handleClick.mockClear();

    rerender(
      <Button loading={true} onClick={handleClick}>
        button
      </Button>,
    );

    await user.click(el);

    expect(handleClick.mock.calls.length).toBe(0);
    handleClick.mockClear();
  });

  it('Test component size', () => {
    const componentSizes: Array<SizeVariant> = ['small', 'middle', 'large'];

    const { container, rerender } = render(
      <ThemeProvider>
        <Button>button</Button>
      </ThemeProvider>,
    );

    componentSizes.forEach((componentSize) => {
      rerender(
        <ThemeProvider sizeVariant={componentSize}>
          <Button>button</Button>
        </ThemeProvider>,
      );
      expect(container.querySelector(`.xl-button--size-${componentSize}`)).not.toBe(null);
    });
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
