import { isDevelopment, isEqual, isServer, warning } from '@xl-vision/utils';
import React, { useEffect, useLayoutEffect, useState } from 'react';

let isWarned = false;

const useSyncExternalStoreServer = <T>(
  _subscribe: (clean: () => void) => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
) => {
  return getServerSnapshot === undefined ? getSnapshot() : getServerSnapshot();
};

// @see https://github.com/facebook/react/blob/cd20376f03212c91057c003bcb640ca9568e87e6/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js
const useSyncExternalStoreClient = <T>(
  subscribe: (clean: () => void) => void,
  getSnapshot: () => T,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getServerSnapshot?: () => T,
) => {
  const value = getSnapshot();

  if (isDevelopment) {
    if (!isWarned) {
      const cachedValue = getSnapshot();

      warning(
        !isEqual(cachedValue, value),
        'The result of getSnapshot should be cached to avoid an infinite loop',
      );
      isWarned = true;
    }
  }

  const [{ inst }, forceUpdate] = useState(() => ({ inst: { value, getSnapshot } }));

  // Track the latest getSnapshot function with a ref. This needs to be updated
  // in the layout phase so we can access it during the tearing check that
  // happens on subscribe.
  useLayoutEffect(() => {
    inst.value = value;
    inst.getSnapshot = getSnapshot;

    // Whenever getSnapshot or subscribe changes, we need to check in the
    // commit phase if there was an interleaved mutation. In concurrent mode
    // this can happen all the time, but even in synchronous mode, an earlier
    // effect may have mutated the store.
    if (checkIfSnapshotChanged(inst)) {
      // Force a re-render.
      forceUpdate({ inst });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe, value, getSnapshot]);

  useEffect(() => {
    // Check for changes right before subscribing. Subsequent changes will be
    // detected in the subscription handler.
    if (checkIfSnapshotChanged(inst)) {
      // Force a re-render.
      forceUpdate({ inst });
    }
    const handleStoreChange = () => {
      // TODO: Because there is no cross-renderer API for batching updates, it's
      // up to the consumer of this library to wrap their subscription event
      // with unstable_batchedUpdates. Should we try to detect when this isn't
      // the case and print a warning in development?

      // The store changed. Check if the snapshot changed since the last time we
      // read from the store.
      if (checkIfSnapshotChanged(inst)) {
        // Force a re-render.
        forceUpdate({ inst });
      }
    };
    // Subscribe to the store and return a clean-up function.
    return subscribe(handleStoreChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe]);

  return value;
};

function checkIfSnapshotChanged<T>(inst: { value: T; getSnapshot: () => T }): boolean {
  const latestGetSnapshot = inst.getSnapshot;
  const prevValue = inst.value;
  try {
    const nextValue = latestGetSnapshot();
    return !isEqual(prevValue, nextValue);
  } catch (error) {
    return true;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default typeof React.useSyncExternalStore === 'function'
  ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (React.useSyncExternalStore as typeof useSyncExternalStoreClient)
  : isServer
  ? useSyncExternalStoreServer
  : useSyncExternalStoreClient;
