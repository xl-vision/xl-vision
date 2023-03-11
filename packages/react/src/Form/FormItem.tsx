import { Controller, Rule, useWatchErrors } from '@xl-vision/form';
import { isProduction } from '@xl-vision/utils';
import {
  Children,
  cloneElement,
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import FormContext from './FormContext';
import { Row, Col, ColProps } from '../Row';
import { styled } from '../styles';
import { ComponentSize, useTheme } from '../ThemeProvider';

export type LabelAlign = 'left' | 'right';

export type FormItemProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  label?: ReactNode;
  labelAlign?: LabelAlign;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  children: ReactElement;
  rules?: Rule | Array<Rule>;
};
const displayName = 'FormItem';

const FormItemRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})<{ size: ComponentSize }>(({ theme, styleProps }) => {
  const { styleSize, typography } = theme;
  const { size } = styleProps;

  const themeSize = styleSize[size];

  const fontSize = typography.body1.info.size * themeSize.fontSize;

  return {
    marginBottom: fontSize + themeSize.padding.y * 2,
  };
});

let uuid = 0;

const FormItem = forwardRef<any, FormItemProps>((props, ref) => {
  const {
    label,
    labelCol: labelColProp,
    wrapperCol: wrapperColProp,
    children,
    labelAlign: labelAlignProp,
    name,
    rules,
    ...others
  } = props;

  const [formItemId] = useState(() => `form-item-${uuid++}`);

  const {
    labelCol: labelColContext,
    wrapperCol: wrapperColContext,
    labelAlign: labelAlignContext,
    size: sizeContext,
    form,
  } = useContext(FormContext);

  const { componentSize } = useTheme();

  const labelCol = labelColProp || labelColContext;
  const wrapperCol = wrapperColProp || wrapperColContext;
  const labelAlign = labelAlignProp || labelAlignContext || 'end';

  const size = sizeContext || componentSize;

  const error = useWatchErrors({ form: form!, field: name });

  const message = useMemo(() => {
    const keys = Object.keys(error);
    if (keys.length) {
      return error[keys[0]];
    }
    return '';
  }, [error]);

  const child = Children.only(children);

  return (
    <FormItemRoot ref={ref} styleProps={{ size }} {...others}>
      <Row>
        <Col style={{ textAlign: labelAlign }} {...labelCol}>
          {label && <label htmlFor={formItemId}>{label}</label>}
        </Col>
        <Col {...wrapperCol}>
          <Controller
            rules={rules}
            field={name}
            form={form!}
            render={(fieldProps) =>
              cloneElement(child, {
                id: formItemId,
                ...fieldProps,
              })
            }
          />
        </Col>
      </Row>
    </FormItemRoot>
  );
});

if (!isProduction) {
  FormItem.displayName = displayName;
  FormItem.propTypes = {};
}

export default FormItem;
