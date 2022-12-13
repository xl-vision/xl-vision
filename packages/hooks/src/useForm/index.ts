import { useState, ChangeEvent } from 'react';
import useConstantFn from '../useConstantFn';
import getEventValue from './utils/getEventValue';

export type FormOptions<V> = {
  defaultValues?: V;
};

const useForm = <V extends Record<string, any>>({ defaultValues }: FormOptions<V> = {}) => {
  const [values, setValues] = useState<Partial<V>>(defaultValues || {});

  const register = useConstantFn(<K extends keyof V>(field: K) => {
    const value = values?.[field];
    return {
      value,
      onChange: (e: V[K] | ChangeEvent) => {
        const v = getEventValue<V[K]>(e);
        setValues((prev) => ({ ...prev, [field]: v }));
      },
    };
  });

  return {
    register,
  };
};

export default useForm;
