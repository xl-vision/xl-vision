import EmptyLayout from './EmptyLayout';
import DefaultLayout from './DefaultLayout';

const LayoutMap = {
  default: DefaultLayout,
  empty: EmptyLayout,
};

export default LayoutMap;

export type LayoutKey = keyof typeof LayoutMap;
