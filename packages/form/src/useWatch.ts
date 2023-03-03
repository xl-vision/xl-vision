import { useCallback, useEffect, useState } from 'react';
import FormStore from './FormStore';

export type WatchOptions<T extends Record<string, any>, K extends keyof T = keyof T> = {
  formStore: FormStore<T>;
  field?: K;
};

function useWatch<T extends Record<string, any>, K extends keyof T>(
  o: Omit<WatchOptions<T, K>, 'field'> & { field: K },
): T[K];

function useWatch<T extends Record<string, any>>(o: Omit<WatchOptions<T>, 'field'>): T;

function useWatch<T extends Record<string, any>>({ formStore, field }: WatchOptions<T>) {
  const [value, setValue] = useState(() => formStore.getValue(field as any));
  const [errors, setErrors] = useState(() => formStore.getValue(field as any));

  const listener = useCallback((v: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setValue(v);
  }, []);

  useEffect(() => {
    if (field) {
      formStore.watchValue(field, listener);
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
  return value;
}

export default useWatch;
