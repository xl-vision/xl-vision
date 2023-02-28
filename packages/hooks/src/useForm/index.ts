import { useState, useRef, ChangeEvent, useCallback, useEffect } from 'react';
import getEventValue from './utils/getEventValue';
import useConstantFn from '../useConstantFn';

export type FormOptions<V> = {
  defaultValues?: V;
};

const useForm = <V extends Record<string, string>>({ defaultValues }: FormOptions<V> = {}) => {
  const [values, setValues] = useState<Partial<V>>(defaultValues || {});

  const controlOnChangeStore = useRef<Partial<Record<keyof V, (v: any) => void>>>({});

  const controlFieldNames = useRef<Set<keyof V>>();

  const handleRegisterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    const { name } = target;

    const v = getEventValue<string>(e);
    setValues((prev) => ({ ...prev, [name]: v }));

    target.value = v;
  }, []);

  const handleRegisterRef = useConstantFn((el: HTMLInputElement | null) => {
    if (!el) {
      return;
    }

    const { name } = el;

    el.value = values[name] || '';
  });

  const register = useConstantFn(<K extends keyof V>(field: K) => {
    return {
      name: field,
      // value,
      onChange: handleRegisterChange,
      ref: handleRegisterRef,
    };
  });

  const control = useConstantFn(<K extends keyof V>(field: K) => {
    controlFieldNames.current = controlFieldNames.current || new Set();

    controlFieldNames.current.add(field);

    let onChange = controlOnChangeStore.current[field];

    if (!onChange) {
      onChange = (v: V[K]) => {
        setValues((prev) => ({ ...prev, [field]: v }));
      };
      controlOnChangeStore.current[field] = onChange;
    }

    return {
      name: field,
      value: values[field],
      onChange,
    };
  });

  return {
    values,
    register,
    control,
  };
};

export default useForm;
