import Dropdown from './Dropdown';
import DropdownMenu from './DropdownMenu';
import DropdownSubmenu from './DropdownSubmenu';
import DropdownDivider from './DropdownDivider';

export * from './Dropdown';
export * from './DropdownMenu';

const DropdownWithMenu = Dropdown as typeof Dropdown & {
  Menu: typeof DropdownMenu;
  Submenu: typeof DropdownSubmenu;
  Divider: typeof DropdownDivider;
};

DropdownWithMenu.Menu = DropdownMenu;
DropdownWithMenu.Submenu = DropdownSubmenu;
DropdownWithMenu.Divider = DropdownDivider;

export default DropdownWithMenu;
