import Dropdown from './Dropdown';
import DropdownDivider from './DropdownDivider';
import DropdownItem from './DropdownItem';
import DropdownSubmenu from './DropdownSubmenu';

export * from './Dropdown';
export { default as Dropdown } from './Dropdown';
export * from './DropdownDivider';
export { default as DropdownDivider } from './DropdownDivider';
export * from './DropdownItem';
export { default as DropdownItem } from './DropdownItem';
export * from './DropdownSubmenu';
export { default as DropdownSubmenu } from './DropdownSubmenu';

const DropdownWithMenu = Dropdown as typeof Dropdown & {
  Divider: typeof DropdownDivider;
  Item: typeof DropdownItem;
  submenu: typeof DropdownSubmenu;
};

DropdownWithMenu.Divider = DropdownDivider;
DropdownWithMenu.Item = DropdownItem;
DropdownWithMenu.submenu = DropdownSubmenu;

export default DropdownWithMenu;
