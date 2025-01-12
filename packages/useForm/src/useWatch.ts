import { useCallback, useEffect, useState } from 'react';
import { Form } from './useForm';

function useWatch<T extends Record<string, unknown>, K extends keyof T>(o: {
  form: Form<T>;
  field: K;
}): T[K];

function useWatch<T extends Record<string, unknown>>(o: { form: Form<T> }): T;

function useWatch<T extends Record<string, unknown>, K extends keyof T>({
  form,
  field,
}: {
  form: Form<T>;
  field?: K;
}) {
  const { store } = form;

  const [values, setValues] = useState<Partial<T> | T[K]>(() => store.getValue(field as K));

  const listener = useCallback((v: Partial<T> | T[K]) => {
    setValues(v);
  }, []);

  useEffect(() => {
    if (field) {
      store.watchValue(field, listener);
    } else {
      store.watchValue(listener);
    }

    return () => {
      if (field) {
        store.unwatchValue(field, listener);
      } else {
        store.unwatchValue(listener);
      }
    };
  }, [listener, store, field]);

  return values;
}

export default useWatch;
