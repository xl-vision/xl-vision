import { useConstantFn } from '@xl-vision/hooks';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import FormStore, { ErrorMap } from './FormStore';
import { Rule, Trigger } from './types';
import isCheckBoxInput from './utils/isCheckBoxInput';

export type FormOptions<T> = {
  defaultValues?: T;
  values?: T;
  trigger?: Trigger;
  eager?: boolean;
};

export type RegisterOptions = {
  rules?: Array<Rule> | Rule;
};

export type ValidateOptions = {
  eager?: boolean;
};

export type Validate<T extends Record<string, any>> = {
  (options?: ValidateOptions): Promise<Partial<Record<keyof T, Array<ErrorMap>>>>;
  <K extends keyof T>(field: K, options?: ValidateOptions): Promise<Array<ErrorMap>>;
};

const useForm = <T extends Record<string, any> = Record<string, any>>({
  defaultValues,
  values,
  trigger = 'change',
  eager,
}: FormOptions<T> = {}) => {
  const [formStore] = useState(() => new FormStore<T>(values || defaultValues || {}));

  const rulesRef = useRef<Partial<Record<keyof T, Array<Rule>>>>({});

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

      if (trigger === 'change') {
        formStore
          .validate(name, {
            eager,
            trigger: 'change',
            rules: rulesRef.current[name] || [],
          })
          .catch((err) => console.error(err));
      }
    },
    [formStore, trigger, eager],
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

  const validate = useCallback<Validate<T>>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <K extends keyof T>(field?: K | ValidateOptions, options?: ValidateOptions) => {
      if (!field) {
        return formStore.validate({
          eager,
          rulesMap: rulesRef.current,
        });
      }

      if (typeof field === 'object') {
        return formStore.validate({
          eager: field?.eager || eager,
          rulesMap: rulesRef.current,
        });
      }

      return formStore.validate(field, {
        eager: options?.eager || eager,
        rules: rulesRef.current[field] || [],
      });
    },
    [formStore, eager],
  );

  const register = useConstantFn((field: keyof T, { rules }: RegisterOptions = {}) => {
    rulesRef.current[field] = Array.isArray(rules) ? rules : rules ? [rules] : [];
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
    validate,
  };
};

export default useForm;
