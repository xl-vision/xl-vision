import { useConstantFn } from '@xl-vision/hooks';
import { useRef, ChangeEvent, useCallback, useMemo } from 'react';
import getEventValue from './utils/getEventValue';

export type FormOptions<T> = {
  defaultValues?: T;
};

const useForm = <T extends Record<string, any> = Record<string, any>>({
  defaultValues,
}: FormOptions<T> = {}) => {
  const valueStore = useRef<Partial<T>>(defaultValues || {});

  const handleRegisterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    const { name } = target;

    const v = getEventValue<string>(e);

    valueStore.current = { ...valueStore.current, [name]: v };

    target.value = v;
  }, []);

  const handleRegisterRef = useConstantFn((el: HTMLInputElement | null) => {
    if (!el) {
      return;
    }

    const { name } = el;

    el.value = valueStore.current[name] || '';
  });

  const getValues = useCallback(<K extends keyof T>(field?: K) => {
    if (field) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return valueStore.current[field];
    }

    return valueStore.current;
  }, []);

  const register = useConstantFn((field: keyof T) => {
    return {
      name: field,
      onChange: handleRegisterChange,
      ref: handleRegisterRef,
    };
  });

  const control = useMemo(() => {
    return {};
  }, []);

  return {
    getValues,
    register,
    control,
  };
};

export default useForm;
