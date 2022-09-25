import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider, Input, Button, ComponentSize } from '@xl-vision/react';

describe('Input', () => {
  it('test component size', () => {
    const componentSizes: Array<ComponentSize> = ['small', 'middle', 'large'];

    const { container, rerender } = render(
      <ThemeProvider>
        <Input />
      </ThemeProvider>,
    );

    componentSizes.forEach((componentSize) => {
      rerender(
        <ThemeProvider theme={{ componentSize }}>
          <Input />
        </ThemeProvider>,
      );

      expect(container.querySelector(`.xl-input--size-${componentSize}`)).not.toBe(null);
    });
  });

  it('test disabled state', () => {
    const { rerender, container } = render(<Input />);

    const input = container.querySelector('input')!;

    fireEvent.focus(input);

    expect(container.querySelector('.xl-input--focused')).not.toBe(null);
    expect(container.querySelector('.xl-input--disabled')).toBe(null);

    rerender(<Input disabled={true} />);

    expect(container.querySelector('.xl-input--disabled')).not.toBe(null);
    expect(container.querySelector('.xl-input--focused')).toBe(null);
  });

  it('test default value', () => {
    const msg = 'msg';

    const { container } = render(<Input defaultValue={msg} />);

    const input = container.querySelector('input')!;

    expect(input.value).toBe(msg);

    const newMsg = 'new msg';

    fireEvent.change(input, {
      target: {
        value: newMsg,
      },
    });

    expect(input.value).toBe(newMsg);
  });

  it('test controlled and uncontrolled state', () => {
    const msg = 'msg';

    const { container, rerender } = render(<Input />);

    const input = container.querySelector('input')!;

    fireEvent.change(input, {
      target: {
        value: msg,
      },
    });

    expect(input.value).toBe(msg);

    const newMsg = 'new msg';

    rerender(<Input value={newMsg} />);

    fireEvent.change(input, {
      target: {
        value: msg,
      },
    });

    expect(input.value).toBe(newMsg);
  });
});

describe('InputGroup', () => {
  it('test size', () => {
    const componentSizes: Array<ComponentSize> = ['small', 'middle', 'large'];

    const { rerender, container } = render(
      <Input.Group>
        <Button>button</Button>
        <Input />
      </Input.Group>,
    );

    componentSizes.forEach((componentSize) => {
      rerender(
        <Input.Group size={componentSize}>
          <Button>button</Button>
          <Input />
        </Input.Group>,
      );

      expect(container.querySelector(`.xl-input--size-${componentSize}`)).not.toBe(null);
      expect(container.querySelector(`.xl-button--size-${componentSize}`)).not.toBe(null);
    });
  });
});
