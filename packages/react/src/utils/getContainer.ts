import { isServer, warning } from '@xl-vision/utils';

export type ContainerReturnType<E extends Element = Element> = E | string | undefined | null;
export type ContainerType<E extends Element = Element> =
  | ContainerReturnType<E>
  | (() => ContainerReturnType<E>);

const getContainer = <E extends Element = Element>(container: ContainerType<E>): E | null => {
  if (isServer) {
    return null;
  }

  const actualContainer = typeof container === 'function' ? container() : container;

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
export default getContainer;
