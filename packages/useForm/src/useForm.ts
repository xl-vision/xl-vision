import { useConstantFn } from '@xl-vision/hooks';
import { ChangeEvent, FocusEvent, useCallback, useEffect, useRef, useState } from 'react';
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
  rules?: Rule | Array<Rule>;
};

export type ValidateOptions = {
  eager?: boolean;
};

export type Validate<T extends Record<string, unknown>> = {
  (options?: ValidateOptions): Promise<void>;
  <K extends keyof T>(field: K, options?: ValidateOptions): Promise<void>;
};

const useForm = <T extends Record<string, unknown>>({
  defaultValues,
  values,
  trigger = 'change',
  eager,
}: FormOptions<T> = {}) => {
  const [formStore] = useState(() => new FormStore<T>(values || defaultValues || {}));

  const rulesMapRef = useRef<Partial<Record<keyof T, Array<Rule>>>>({});

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
          rules: rulesMapRef.current[name],
          trigger: triggerProps,
          defaultTrigger: trigger,
        })
        .catch(console.error);
    },
    [formStore, eager, trigger],
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

      innerValidate(name, 'change');
    },
    [formStore, innerValidate],
  );

  const handleRegisterBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const { target } = e;

      const { name } = target;
      innerValidate(name, 'blur');
    },
    [innerValidate],
  );

  const handleRegisterRef = useConstantFn((el: HTMLInputElement | null) => {
    if (!el) {
      return;
    }

    const { name } = el;

    const value = formStore.getValue(name as keyof T);

    const isCheckBox = isCheckBoxInput(el);

    if (isCheckBox) {
      el.checked = !!value;
    } else {
      el.value = (value || '') as string;
    }
  });

  const getValue = useCallback<typeof formStore.getValue>(
    // @ts-expect-error field is optional
    <K extends keyof T>(field?: K) => {
      return formStore.getValue(field as K);
    },
    [formStore],
  );

  const getErrors = useCallback<typeof formStore.getErrors>(
    // @ts-expect-error field is optional
    <K extends keyof T>(field?: K) => {
      return formStore.getErrors(field as K);
    },
    [formStore],
  );

  const validate = useCallback<Validate<T>>(
    async <K extends keyof T>(field?: K | ValidateOptions, options?: ValidateOptions) => {
      if (typeof field === 'object' || field === undefined) {
        const errors = await formStore.validate({
          eager: field?.eager || eager,
          rulesMap: rulesMapRef.current,
          defaultTrigger: trigger,
        });

        if (Object.keys(errors).some((it) => Object.keys(it).length)) {
          throw new ValidateError(errors);
        }

        return;
      }

      const errors = await formStore.validate(field, {
        eager: options?.eager || eager,
        rules: rulesMapRef.current[field],
        defaultTrigger: trigger,
      });

      if (errors) {
        throw new ValidateError(errors);
      }
    },
    [formStore, eager, trigger],
  );

  const setRules = useCallback((field: keyof T, rules?: Rule | Array<Rule>) => {
    if (rules) {
      rulesMapRef.current[field] = Array.isArray(rules) ? rules : [rules];
    }
  }, []);

  const register = useConstantFn((field: keyof T, { rules }: RegisterOptions = {}) => {
    setRules(field, rules);
    return {
      name: field,
      onChange: handleRegisterChange,
      onBlur: handleRegisterBlur,
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
      setRules,
      validate: innerValidate,
    },
  };
};

export default useForm;

export type Form<T extends Record<string, unknown>> = ReturnType<typeof useForm<T>>['form'];
