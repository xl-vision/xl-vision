/* eslint-disable import/prefer-default-export */
import { isMemo } from 'react-is';

export const supportRef = (nodeOrComponent: unknown): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const type = isMemo(nodeOrComponent) ? nodeOrComponent.type.type : (nodeOrComponent as any).type;

  // Function component node
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (typeof type === 'function' && !type.prototype?.render) {
    return false;
  }

  // Class component
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (typeof nodeOrComponent === 'function' && !nodeOrComponent.prototype?.render) {
    return false;
  }

  return true;
};
