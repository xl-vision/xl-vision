import { useCallback, useEffect, useState } from 'react';
import FormStore from './FormStore';

function useWatch<T extends Record<string, any>, K extends keyof T>(o: {
  formStore: FormStore<T>;
  field: K;
}): T[K];

function useWatch<T extends Record<string, any>>(o: { formStore: FormStore<T> }): T;

function useWatch<T extends Record<string, any>, K extends keyof T>({
  formStore,
  field,
}: {
  formStore: FormStore<T>;
  field?: K;
}) {
  const [values, setValues] = useState<T | T[K]>(() => formStore.getValue(field as any));

  const listener = useCallback((v: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setValues(v);
  }, []);

  useEffect(() => {
    if (field) {
      formStore.watchValue(field, listener);
      formStore.watchError(field, listener);
    } else {
      formStore.watchValue(listener);
    }

    return () => {
      if (field) {
        formStore.unwatchValue(field, listener);
      } else {
        formStore.unwatchValue(listener);
      }
    };
  }, [listener, formStore, field]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return values;
}

export default useWatch;
