import DefaultLayout from './DefaultLayout';
import HeaderLayout from './HeaderLayout';
import ComponentLayout from './ComponentLayout';

const LayoutMap = {
  default: DefaultLayout,
  header: HeaderLayout,
  component: ComponentLayout,
};

export default LayoutMap;

export type LayoutKey = keyof typeof LayoutMap;
