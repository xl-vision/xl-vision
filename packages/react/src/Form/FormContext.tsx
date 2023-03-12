import { createContext } from 'react';
import { LabelAlign } from './FormItem';
import { Form } from './useForm';
import { ColProps } from '../Row';
import { ComponentSize } from '../ThemeProvider';

const FormContext = createContext<{
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  labelAlign?: LabelAlign;
  size?: ComponentSize;
  form?: Form;
}>({});

export default FormContext;
