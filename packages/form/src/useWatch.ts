import { useCallback, useEffect, useState } from 'react';
import { Form } from './useForm';

function useWatch<T extends Record<string, any>, K extends keyof T>(o: {
  form: Form<T>;
  field: K;
}): T[K];

function useWatch<T extends Record<string, any>>(o: { form: Form<T> }): T;

function useWatch<T extends Record<string, any>, K extends keyof T>({
  form,
  field,
}: {
  form: Form<T>;
  field?: K;
}) {
  const { store } = form;

  const [values, setValues] = useState<T | T[K]>(() => store.getValue(field as any));

  const listener = useCallback((v: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return values;
}

export default useWatch;
