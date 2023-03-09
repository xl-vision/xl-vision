import Form from './Form';
import FormItem from './FormItem';

export * from './Form';
export * from './FormItem';

const obj = Form as typeof Form & {
  Item: typeof FormItem;
};

obj.Item = FormItem;

export default obj;
