import Dropdown from './Dropdown';
import DropdownDivider from './DropdownDivider';
import DropdownItem from './DropdownItem';

export * from './Dropdown';
export { default as Dropdown } from './Dropdown';
export * from './DropdownDivider';
export { default as DropdownDivider } from './DropdownDivider';
export * from './DropdownItem';
export { default as DropdownItem } from './DropdownItem';

const DropdownWithMenu = Dropdown as typeof Dropdown & {
  Divider: typeof DropdownDivider;
  Item: typeof DropdownItem;
};

DropdownWithMenu.Divider = DropdownDivider;
DropdownWithMenu.Item = DropdownItem;

export default DropdownWithMenu;
