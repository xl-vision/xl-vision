import { isEqual } from '@xl-vision/utils';
import { useRef } from 'react';

const DEFAULT_SHOULD_UPDATE = <C extends Array<unknown>>(prev: C, next: C) => {
  return prev.length !== next.length || prev.some((v, i) => !isEqual(v, next[i]));
};

const useEnhancedMemo = <V, C extends Array<unknown>>(
  getValue: () => V,
  condition: C,
  shouldUpdate: (prev: C, next: C) => boolean = DEFAULT_SHOULD_UPDATE,
) => {
  const dataRef = useRef<{
    value?: V;
    condition?: C;
  }>({});

  if (!('value' in dataRef.current) || shouldUpdate(dataRef.current.condition!, condition)) {
    dataRef.current.value = getValue();
    dataRef.current.condition = condition;
  }

  return dataRef.current.value;
};

export default useEnhancedMemo;
