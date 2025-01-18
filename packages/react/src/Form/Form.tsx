import { isProduction } from '@xl-vision/utils';
import { forwardRef } from 'react';

export type FormProps = {};

const displayName = 'Form';

const Form = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  const { ...others } = props;

  return (
    <form {...others} ref={ref}>
      123
    </form>
  );
});

if (!isProduction) {
  Form.displayName = displayName;
}

export default Form;
