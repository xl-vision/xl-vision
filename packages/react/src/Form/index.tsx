import Form from './Form';
import FormItem from './FormItem';
import useForm from './useForm';

export * from './Form';
export * from './FormItem';
export * from './useForm';

const obj = Form as typeof Form & {
  Item: typeof FormItem;
  useForm: typeof useForm;
};

obj.Item = FormItem;
obj.useForm = useForm;

export default obj;
