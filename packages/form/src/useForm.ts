import { useConstantFn } from '@xl-vision/hooks';
import { useRef, ChangeEvent, useCallback, useState } from 'react';
import FormStore from './utils/FormStore';
import isCheckBoxInput from './utils/isCheckBoxInput';

export type FormOptions<T> = {
  defaultValues?: T;
};

const useForm = <T extends Record<string, any> = Record<string, any>>({
  defaultValues,
}: FormOptions<T> = {}) => {
  const valueStore = useRef<Partial<T>>(defaultValues || {});

  const [formStore] = useState(() => new FormStore<T>(valueStore));

  const handleRegisterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { target } = e;

      const { name } = target;

      const isCheckBox = isCheckBoxInput(target);

      const v = isCheckBox ? target.checked : (target as HTMLInputElement).value;

      valueStore.current = { ...valueStore.current, [name]: v };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      formStore.dispatch(v as any, name);

      if (isCheckBox) {
        target.checked = v as boolean;
      } else {
        (target as HTMLInputElement).value = v as string;
      }
    },
    [formStore],
  );

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

  return {
    getValues,
    register,
    formStore,
  };
};

export default useForm;
