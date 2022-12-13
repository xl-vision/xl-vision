import { isObject } from '@xl-vision/utils';
import isCheckBoxInput from './isCheckBoxInput';

export default <T>(event: unknown) => {
  if (isObject(event) && (event as Event).target) {
    const { target } = event as Event;
    if (isCheckBoxInput(target)) {
      return target.checked;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return (target as any)?.value as T;
  }
  return event as T;
};
