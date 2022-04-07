import { isServer } from '@xl-vision/utils';
import warning from './warning';

export type ContainerReturnType<E extends Element = Element> = E | string | undefined | null;
export type ContainerType<E extends Element = Element> =
  | ContainerReturnType<E>
  | (() => ContainerReturnType<E>);

export default <E extends Element = Element>(container: ContainerType<E>): E | null => {
  if (isServer) {
    return null;
  }

  let actualContainer: ContainerReturnType<E>;

  if (typeof container === 'function') {
    actualContainer = container();
  } else {
    actualContainer = container;
  }

  if (!actualContainer) {
    return null;
  }

  if (typeof actualContainer === 'string') {
    const node = document.querySelector(actualContainer) as E;
    warning(!node, '<getContainer> querySelector "%s" is null', actualContainer);
    return node;
  }

  return actualContainer;
};
