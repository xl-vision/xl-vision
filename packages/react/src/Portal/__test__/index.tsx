import { Portal } from '@xl-vision/react';
import { render } from '@testing-library/react';

describe('Portal', () => {
  it('test mount on body', () => {
    render(
      <div>
        <Portal container={() => document.body}>
          <div>123</div>
        </Portal>
      </div>,
    );

    expect(document.body).toMatchSnapshot();
  });

  it('test mount on current position', () => {
    const { container } = render(
      <div>
        <Portal container={null}>
          <div>123</div>
        </Portal>
      </div>,
    );
    expect(container).toMatchSnapshot();
  });
});
