import { useCallback, useEffect, useState } from 'react';
import { ErrorMap } from './FormStore';
import { Form } from './useForm';

function useWatchErrors<T extends Record<string, unknown>, K extends keyof T>(o: {
  form: Form<T>;
  field: K;
}): ErrorMap;

function useWatchErrors<T extends Record<string, unknown>>(o: {
  form: Form<T>;
}): Partial<Record<keyof T, ErrorMap>>;

function useWatchErrors<T extends Record<string, unknown>, K extends keyof T>({
  form,
  field,
}: {
  form: Form<T>;
  field?: K;
}) {
  const { store } = form;

  const [errors, setErrors] = useState<ErrorMap | Partial<Record<keyof T, ErrorMap>>>(() =>
    store.getErrors(field as keyof T),
  );

  const listener = useCallback((e: ErrorMap | Partial<Record<keyof T, ErrorMap>>) => {
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
