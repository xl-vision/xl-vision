import { ReactElement, useCallback, useEffect } from 'react';
import { Rule } from './types';
import { Form } from './useForm';
import useWatch from './useWatch';

export type RenderProps<V> = {
  value: V;
  onChange: (value: V) => void;
  onBlur: () => void;
};

export type ControllerProps<T extends Record<string, unknown>, K extends keyof T = keyof T> = {
  field: K;
  form: Form<T>;
  render: (props: RenderProps<T[K]>) => ReactElement;
  rules?: Rule | Array<Rule>;
};

const Controller = <T extends Record<string, unknown>>({
  field,
  render,
  form,
  rules,
}: ControllerProps<T>) => {
  const { store, setRules, validate } = form;

  const value = useWatch({ form, field });

  const onChange = useCallback(
    (v: T[keyof T]) => {
      store.setValue(field, v);
      validate(field, 'change');
    },
    [store, field, validate],
  );

  const onBlur = useCallback(() => {
    validate(field, 'blur');
  }, [field, validate]);

  useEffect(() => {
    setRules(field, rules);
  }, [field, rules, setRules]);

  return render({ value, onChange, onBlur });
};

export default Controller;
