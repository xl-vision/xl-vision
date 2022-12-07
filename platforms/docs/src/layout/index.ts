import ComponentLayout from './ComponentLayout';
import DefaultLayout from './DefaultLayout';
import HeaderLayout from './HeaderLayout';
import HookLayout from './HookLayout';

const LayoutMap = {
  default: DefaultLayout,
  header: HeaderLayout,
  component: ComponentLayout,
  hook: HookLayout,
};

export default LayoutMap;

export type LayoutKey = keyof typeof LayoutMap;
