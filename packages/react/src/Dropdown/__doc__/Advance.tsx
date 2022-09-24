import { Button, Dropdown, Tooltip, TooltipProps } from '@xl-vision/react';
import { ReactElement, forwardRef, cloneElement } from 'react';

export type WrapperProps = {
  tooltipProps: Omit<TooltipProps, 'children'>;
  children: ReactElement;
  [key: string]: any;
};

const Wrapper = forwardRef<unknown, WrapperProps>((props, ref) => {
  const { tooltipProps, children, ...others } = props;

  return <Tooltip {...tooltipProps}>{cloneElement(children, { ...others, ref })}</Tooltip>;
});

const Advance = () => {
  const menus = (
    <>
      <Dropdown.Item>1st menu item</Dropdown.Item>
      <Dropdown.Item disabled={true}>2nd menu item</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item>3rd menu item</Dropdown.Item>
    </>
  );

  return (
    <Dropdown menus={menus} trigger='click'>
      <Wrapper tooltipProps={{ content: 'this is a tooltip' }}>
        <Button color='primary'>hover or click</Button>
      </Wrapper>
    </Dropdown>
  );
};

export default Advance;
