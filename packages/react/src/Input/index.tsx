import Input from './Input';
import Password from './Password';
export * from './Input';
export * from './Password';

const obj = Input as typeof Input & {
  Password: typeof Password;
};

obj.Password = Password;

export default obj;
