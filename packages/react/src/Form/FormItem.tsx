import { isProduction } from '@xl-vision/utils';
import { forwardRef, HTMLAttributes, ReactNode, useContext } from 'react';
import FormContext from './FormContext';
import { Row, Col, ColProps } from '../Row';

export type LabelAlign = 'left' | 'right';

export type FormItemProps = HTMLAttributes<HTMLDivElement> & {
  label?: ReactNode;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  labelAlign?: LabelAlign;
};
const displayName = 'FormItem';

const FormItem = forwardRef<any, FormItemProps>((props, ref) => {
  const {
    label,
    labelCol: labelColProp,
    wrapperCol: wrapperColProp,
    children,
    labelAlign: labelAlignProp,
    ...others
  } = props;

  const {
    labelCol: labelColContext,
    wrapperCol: wrapperColContext,
    labelAlign: labelAlignContext,
  } = useContext(FormContext);

  const labelCol = labelColProp || labelColContext;
  const wrapperCol = wrapperColProp || wrapperColContext;
  const labelAlign = labelAlignProp || labelAlignContext || 'right';

  return (
    <div ref={ref} {...others}>
      <Row>
        <Col style={{ textAlign: labelAlign }} {...labelCol}>
          {label && <label htmlFor=''>{label}</label>}
        </Col>
        <Col {...wrapperCol}>{children}</Col>
      </Row>
    </div>
  );
});

if (!isProduction) {
  FormItem.displayName = displayName;
  FormItem.propTypes = {};
}

export default FormItem;
