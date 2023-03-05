import { useCallback, useEffect, useState } from 'react';
import { ErrorMap } from './FormStore';
import { Form } from './useForm';

function useWatchErrors<T extends Record<string, any>, K extends keyof T>(o: {
  form: Form<T>;
  field: K;
}): ErrorMap;

function useWatchErrors<T extends Record<string, any>>(o: {
  form: Form<T>;
}): Partial<Record<keyof T, ErrorMap>>;

function useWatchErrors<T extends Record<string, any>, K extends keyof T>({
  form,
  field,
}: {
  form: Form<T>;
  field?: K;
}) {
  const { store } = form;

  const [errors, setErrors] = useState<ErrorMap | Partial<Record<keyof T, ErrorMap>>>(() =>
    store.getErrors(field as any),
  );

  const listener = useCallback((e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setErrors(e);
  }, []);

  useEffect(() => {
    if (field) {
      store.watchError(field, listener);
    } else {
      store.watchError(listener);
    }

    return () => {
      if (field) {
        store.unwatchError(field, listener);
      } else {
        store.unwatchError(listener);
      }
    };
  }, [listener, store, field]);

  return errors;
}

export default useWatchErrors;
