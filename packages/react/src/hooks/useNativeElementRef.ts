import { findDomNode, setRef } from '@xl-vision/utils';
import { ReactInstance, Ref, RefCallback, useCallback } from 'react';

const useNativeElementRef = <T extends Element>(ref: Ref<T>) => {
  const nodeWrapRef = useCallback<RefCallback<ReactInstance>>(
    (instance) => {
      if (!instance || typeof instance !== 'object') {
        setRef(ref, null);
        return;
      }

      if ('nativeElement' in instance) {
        const nativeElement = instance.nativeElement;
        setRef(ref, nativeElement);
        return;
      }

      setRef(ref, findDomNode<T>(instance));
    },
    [ref],
  );

  return nodeWrapRef;
};

export default useNativeElementRef;
