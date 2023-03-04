import { useCallback, useEffect, useState } from 'react';
import FormStore, { ErrorMap } from './FormStore';

function useWatchErrors<T extends Record<string, any>, K extends keyof T>(o: {
  formStore: FormStore<T>;
  field: K;
}): Array<ErrorMap>;

function useWatchErrors<T extends Record<string, any>>(o: {
  formStore: FormStore<T>;
}): Partial<Record<keyof T, Array<ErrorMap>>>;

function useWatchErrors<T extends Record<string, any>, K extends keyof T>({
  formStore,
  field,
}: {
  formStore: FormStore<T>;
  field?: K;
}) {
  const [errors, setErrors] = useState<Array<ErrorMap> | Partial<Record<keyof T, Array<ErrorMap>>>>(
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
