import { isProduction } from '@xl-vision/utils';
import { ComponentType, forwardRef, Fragment, useMemo } from 'react';
import FormContext from './FormContext';
import { LabelAlign } from './FormItem';
import { ColProps } from '../Row';

export type FormProps<P = {}> = P & {
  component?: ComponentType<P> | keyof JSX.IntrinsicElements | false;
  disabled?: boolean;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  labelAlign?: LabelAlign;
};
const displayName = 'Form';

const Form = forwardRef<any, FormProps>((props, ref) => {
  const { component = 'form', labelCol, wrapperCol, labelAlign, layout, ...others } = props;

  const Component = component || Fragment;

  const context = useMemo(() => {
    return {
      labelCol,
      wrapperCol,
      labelAlign,
    };
  }, [labelCol, wrapperCol, labelAlign]);

  return (
    <FormContext.Provider value={context}>
      {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore */}
      <Component autoComplete='off' ref={ref} {...others} />
    </FormContext.Provider>
  );
});

if (!isProduction) {
  Form.displayName = displayName;
  Form.propTypes = {};
}

export default Form;
