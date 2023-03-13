const useSyncExternalStore = <T>(
  subscribe: (clean: () => void) => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
) => {};

export default useSyncExternalStore;
