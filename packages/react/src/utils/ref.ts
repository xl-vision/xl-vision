import { isValidElement, ReactElement, ReactNode, Ref } from 'react';
import { ForwardRef, isFragment, isMemo } from 'react-is';

export const supportRef = (nodeOrComponent: unknown): boolean => {
  if (
    isReactElement(nodeOrComponent) &&
    Object.prototype.propertyIsEnumerable.call(nodeOrComponent.props as { ref?: Ref<any> }, 'ref')
  ) {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const type = isMemo(nodeOrComponent) ? nodeOrComponent.type.type : (nodeOrComponent as any).type;

  // Function component node
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (typeof type === 'function' && !type.prototype?.render && type.$$typeof !== ForwardRef) {
    return false;
  }

  // Class component
  if (
    typeof nodeOrComponent === 'function' &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    !nodeOrComponent.prototype?.render &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (nodeOrComponent as any).$$typeof !== ForwardRef
  ) {
    return false;
  }

  return true;
};

export const getNodeRef = <T>(node: ReactNode) => {
  if (node && isReactElement(node)) {
    // Source from:
    // https://github.com/mui/material-ui/blob/master/packages/mui-utils/src/getReactNodeRef/getReactNodeRef.ts
    return Object.prototype.propertyIsEnumerable.call(node.props as object, 'ref')
      ? (node.props as { ref?: Ref<T> }).ref
      : (node as { ref?: Ref<T> }).ref;
  }
  return null;
};

const isReactElement = (node: unknown): node is ReactElement => {
  return isValidElement(node) && !isFragment(node);
};
