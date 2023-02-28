import { useState, useRef } from 'react';
import getEventValue from './utils/getEventValue';
import useConstantFn from '../useConstantFn';

export type FormOptions<V> = {
  defaultValues?: V;
};

const useForm = <V extends Record<string, string>>({ defaultValues }: FormOptions<V> = {}) => {
  const [values, setValues] = useState<Partial<V>>(defaultValues || {});

  const changeFnStore = useRef<Partial<Record<keyof V, (e: any) => void>>>({});

  const register = useConstantFn(<K extends keyof V>(field: K) => {
    const value = values?.[field];

    let onChange = changeFnStore.current[field];

    if (!onChange) {
      onChange = (e: any) => {
        const v = getEventValue<string>(e);
        setValues((prev) => ({ ...prev, [field]: v }));
      };
      changeFnStore.current[field] = onChange;
    }

    return {
      name: field,
      value,
      onChange,
      ref(el: HTMLInputElement | null) {
        if (!el) {
          delete changeFnStore.current[field];
        }
      },
    };
  });

  return {
    register,
  };
};

export default useForm;
