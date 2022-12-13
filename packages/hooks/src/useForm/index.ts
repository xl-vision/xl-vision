import { useState, ChangeEvent, useCallback, useRef } from 'react';
import useConstantFn from '../useConstantFn';
import getEventValue from './utils/getEventValue';

export type FormOptions<V> = {
  defaultValues?: V;
};

const useForm = <V extends Record<string, string>>({ defaultValues }: FormOptions<V> = {}) => {
  const [values, setValues] = useState<Partial<V>>(defaultValues || {});

  const domRefs = useRef<Partial<Record<keyof V, HTMLInputElement>>>({});

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { name } = target;
    const v = getEventValue<string>(e);
    setValues((prev) => ({ ...prev, [name]: v }));

    const currentEl = domRefs.current[name];

    if (currentEl && v) {
      currentEl.value = v;
    }
  }, []);

  const register = useConstantFn(<K extends keyof V>(field: K) => {
    const value = values?.[field];
    return {
      name: field,
      onChange,
      ref(el: HTMLInputElement | null) {
        if (!el) {
          delete domRefs.current[field];
          return;
        }
        domRefs.current[field] = el;
        if (value) {
          el.value = value;
        }
      },
    };
  });

  return {
    register,
  };
};

export default useForm;
