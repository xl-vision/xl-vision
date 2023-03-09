import { createContext } from 'react';
import { LabelAlign } from './FormItem';
import { ColProps } from '../Row';

const FormContext = createContext<{
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  labelAlign?: LabelAlign;
}>({});

export default FormContext;
