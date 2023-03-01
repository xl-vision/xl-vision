import { FC } from 'react';
import FormStore from './utils/FormStore';

export type ControllerProps<T extends Record<string, any> = Record<string, any>> = {
  name: keyof T;
  render: () => void;
  formStore: FormStore<T>;
};

const Controller: FC<ControllerProps> = ({ name, render, formStore }) => {
    const
};

export default Controller;
