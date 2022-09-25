import React from 'react';
import { render } from '@testing-library/react';
import { DeleteFilled } from '../src';

describe('Icon', () => {
  it('test render', () => {
    const { container } = render(<DeleteFilled />);

    expect(container).toMatchSnapshot();
  });

  it('test ref', () => {
    const fn = jest.fn();
    render(<DeleteFilled ref={fn} />);

    expect((fn.mock.calls[0] as Array<any>)[0]).toBeInstanceOf(SVGSVGElement);
  });
});
