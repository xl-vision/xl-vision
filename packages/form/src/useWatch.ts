import { useCallback, useEffect, useState } from 'react';
import FormStore, { Watcher } from './utils/FormStore';

export type WatchOptions<T extends Record<string, any>> = {
  formStore: FormStore<T>;
  field?: keyof T;
};

const useWatch = <T extends Record<string, any>>({ formStore, field }: WatchOptions<T>) => {
  const [value, setValue] = useState(() => formStore.getStore(field));

  const watcher = useCallback<Watcher<T>>((v) => {
    setValue(v);
  }, []);

  useEffect(() => {
    formStore.addWatcher(watcher, field);

    return () => {
      formStore.removeWatcher(watcher, field);
    };
  }, [watcher, formStore, field]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return value;
};

export default useWatch;
