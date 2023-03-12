import { Controller, Rule, useWatchErrors } from '@xl-vision/useForm';
import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
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
  children: ReactElement;
  name: string;
  label?: ReactNode;
  labelAlign?: LabelAlign;
  labelCol?: ColProps;
  rules?: Rule | Array<Rule>;
  wrapperCol?: ColProps;
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

const FormItemMessage = styled('div', {
  name: displayName,
  slot: 'Message',
})(({ theme }) => {
  const { color, typography } = theme;

  return {
    position: 'absolute',
    color: color.themes.error.color,
    ...typography.caption,
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
    className,
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

  const { componentSize, clsPrefix } = useTheme();

  const rootClassName = `${clsPrefix}-${displayName}`;

  const labelCol = labelColProp || labelColContext;
  const wrapperCol = wrapperColProp || wrapperColContext;
  const labelAlign = labelAlignProp || labelAlignContext || 'end';

  const size = sizeContext || componentSize;

  const error = useWatchErrors({ form, field: name });

  const message = useMemo(() => {
    const keys = Object.keys(error);
    if (keys.length) {
      return error[keys[0]];
    }
    return '';
  }, [error]);

  const child = Children.only(children);

  return (
    <FormItemRoot
      className={clsx(rootClassName, className)}
      ref={ref}
      styleProps={{ size }}
      {...others}
    >
      <Row>
        <Col style={{ textAlign: labelAlign }} {...labelCol}>
          {label && <label htmlFor={formItemId}>{label}</label>}
        </Col>
        <Col {...wrapperCol}>
          <Controller
            field={name}
            form={form}
            render={(fieldProps) =>
              cloneElement(child, {
                id: formItemId,
                ...fieldProps,
              })
            }
            rules={rules}
          />
          {message && (
            <FormItemMessage className={`${rootClassName}__message`}>{message}</FormItemMessage>
          )}
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
