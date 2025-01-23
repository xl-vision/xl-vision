import { isProduction } from '@xl-vision/utils';
import { forwardRef } from 'react';
import { styled } from '../styles';

export type FormItemProps = {};

const displayName = 'FormItem';

const FormItemRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {};
});

const FormItem = forwardRef<HTMLDivElement, FormItemProps>((props, ref) => {
  const { ...others } = props;

  return <FormItemRoot>123</FormItemRoot>;
});

if (!isProduction) {
  FormItem.displayName = displayName;
}

export default FormItem;
