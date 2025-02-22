'use client';

import { ReactElement, forwardRef, cloneElement } from 'react';
import { Button, Dropdown, Tooltip, TooltipProps } from '@xl-vision/react';

export type WrapperProps = {
  tooltipProps: Omit<TooltipProps, 'children'>;
  children: ReactElement<any>;
  [key: string]: any;
};

const Wrapper = forwardRef<typeof Tooltip, WrapperProps>((props, ref) => {
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
