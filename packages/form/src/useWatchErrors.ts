import { useCallback, useEffect, useState } from 'react';
import FormStore from './FormStore';

function useWatchErrors<T extends Record<string, any>, K extends keyof T>(o: {
  formStore: FormStore<T>;
  field: K;
}): Array<string>;

function useWatchErrors<T extends Record<string, any>>(o: {
  formStore: FormStore<T>;
}): Partial<Record<keyof T, Array<string>>>;

function useWatchErrors<T extends Record<string, any>, K extends keyof T>({
  formStore,
  field,
}: {
  formStore: FormStore<T>;
  field?: K;
}) {
  const [errors, setErrors] = useState<Array<string> | Partial<Record<keyof T, Array<string>>>>(
    () => formStore.getErrors(field as any),
  );

  const listener = useCallback((e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setErrors(e);
  }, []);

  useEffect(() => {
    if (field) {
      formStore.watchError(field, listener);
    } else {
      formStore.watchError(listener);
    }

    return () => {
      if (field) {
        formStore.unwatchError(field, listener);
      } else {
        formStore.unwatchError(listener);
      }
    };
  }, [listener, formStore, field]);

  return errors;
}

export default useWatchErrors;
