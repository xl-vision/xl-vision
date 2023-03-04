import { useConstantFn } from '@xl-vision/hooks';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import FormStore from './FormStore';
import { Rule, Trigger } from './types';
import isCheckBoxInput from './utils/isCheckBoxInput';
import ValidateError from './ValidateError';

export type FormOptions<T> = {
  defaultValues?: T;
  values?: T;
  trigger?: Trigger;
  eager?: boolean;
};

export type RegisterOptions = {
  rule?: Rule;
};

export type ValidateOptions = {
  eager?: boolean;
};

export type Validate<T extends Record<string, any>> = {
  (options?: ValidateOptions): Promise<void>;
  <K extends keyof T>(field: K, options?: ValidateOptions): Promise<void>;
};

const useForm = <T extends Record<string, any>>({
  defaultValues,
  values,
  trigger = 'change',
  eager,
}: FormOptions<T> = {}) => {
  const [formStore] = useState(() => new FormStore<T>(values || defaultValues || {}));

  const ruleRef = useRef<Partial<Record<keyof T, Rule>>>({});

  useEffect(() => {
    if (values) {
      formStore.setValue(values);
    }
  }, [formStore, values]);

  const innerValidate = useCallback(
    (name: keyof T, triggerProps: Trigger) => {
      formStore
        .validate(name, {
          eager,
          trigger: triggerProps,
          rule: ruleRef.current[name],
        })
        .catch((err) => console.error(err));
    },
    [formStore, eager],
  );

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
        innerValidate(name, 'change');
      }
    },
    [formStore, trigger, innerValidate],
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

  const getErrors = useCallback<typeof formStore.getErrors>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <K extends keyof T>(field?: K) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return formStore.getErrors(field as any);
    },
    [formStore],
  );

  const validate = useCallback<Validate<T>>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async <K extends keyof T>(
      // eslint-disable-next-line default-param-last
      field: K | ValidateOptions = {
        eager,
      },
      options?: ValidateOptions,
    ) => {
      if (typeof field === 'object') {
        const errors = await formStore.validate({
          eager: field?.eager || eager,
          ruleMap: ruleRef.current,
        });

        if (Object.keys(errors).some((it) => Object.keys(it).length)) {
          throw new ValidateError(errors);
        }

        return;
      }

      const errors = await formStore.validate(field, {
        eager: options?.eager || eager,
        rule: ruleRef.current[field],
      });

      if (Object.keys(errors).length) {
        throw new ValidateError(errors);
      }
    },
    [formStore, eager],
  );

  const setRule = useCallback((field: keyof T, rule?: Rule) => {
    if (rule) {
      ruleRef.current[field] = rule;
    }
  }, []);

  const register = useConstantFn((field: keyof T, { rule }: RegisterOptions = {}) => {
    setRule(field, rule);
    return {
      name: field,
      onChange: handleRegisterChange,
      ref: handleRegisterRef,
    };
  });

  return {
    getValue,
    getErrors,
    register,
    validate,
    form: {
      store: formStore,
      trigger,
      setRule,
      validate: innerValidate,
    },
  };
};

export default useForm;

export type Form<T extends Record<string, any>> = ReturnType<typeof useForm<T>>['form'];
