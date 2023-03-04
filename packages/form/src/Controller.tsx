import { ReactElement, useCallback, useEffect } from 'react';
import { Rule } from './types';
import { Form } from './useForm';
import useWatch from './useWatch';

export type RenderProps<V> = {
  value: V;
  onChange: (value: V) => void;
};

export type ControllerProps<T extends Record<string, any>> = {
  field: keyof T;
  form: Form<T>;
  render: (props: RenderProps<T[keyof T]>) => ReactElement;
  rule?: Rule;
};

const Controller = <T extends Record<string, any>>({
  field,
  render,
  form,
  rule,
}: ControllerProps<T>) => {
  const { store, setRule, trigger, validate } = form;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const value = useWatch({ form, field });

  const onChange = useCallback(
    (v: T[keyof T]) => {
      store.setValue(field, v);
      if (trigger === 'change') {
        validate(field, 'change');
      }
    },
    [store, field, trigger, validate],
  );

  useEffect(() => {
    setRule(field, rule);
  }, [field, rule, setRule]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return render({ value, onChange });
};

export default Controller;
