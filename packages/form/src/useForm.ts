import { useConstantFn } from '@xl-vision/hooks';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import FormStore from './FormStore';
import isCheckBoxInput from './utils/isCheckBoxInput';

export type FormOptions<T> = {
  defaultValues?: T;
  values?: T;
};

const useForm = <T extends Record<string, any> = Record<string, any>>({
  defaultValues,
  values,
}: FormOptions<T> = {}) => {
  const [formStore] = useState(() => new FormStore<T>(values || defaultValues || {}));

  useEffect(() => {
    if (values) {
      formStore.setValue(values);
    }
  }, [formStore, values]);

  const handleRegisterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { target } = e;

      const { name } = target;

      const isCheckBox = isCheckBoxInput(target);

      const v = isCheckBox ? target.checked : (target as HTMLInputElement).value;

      formStore.setValue(name, v as T[keyof T]);

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

    el.value = (formStore.getValue(name as keyof T) as string | undefined) || '';
  });

  const getValue = useCallback<typeof formStore.getValue>(
    <K extends keyof T>(field?: K) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return formStore.getValue(field as any);
    },
    [formStore],
  );

  const register = useConstantFn((field: keyof T) => {
    return {
      name: field,
      onChange: handleRegisterChange,
      ref: handleRegisterRef,
    };
  });

  return {
    getValue,
    register,
    formStore,
  };
};

export default useForm;
