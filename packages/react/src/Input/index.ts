import Input from './Input';
import Group from './InputGroup';
import Password from './Password';

export { default as Input } from './Input';
export type { InputProps } from './Input';

export * from './Password';
export { default as Password } from './Password';

export * from './InputGroup';
export { default as InputGroup } from './InputGroup';

const obj = Input as typeof Input & {
  Password: typeof Password;
  Group: typeof Group;
};

obj.Password = Password;
obj.Group = Group;

export default obj;
