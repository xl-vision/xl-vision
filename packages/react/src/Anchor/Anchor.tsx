import { env } from '@xl-vision/utils';
import React from 'react';
import { styled } from '../styles';

export type AnchorProps = {};

const displayName = 'Anchor';

const Root = styled('div', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {};
});

const Anchor = React.forwardRef<HTMLDivElement, AnchorProps>((props, ref) => {
  const { ...others } = props;
  return <Root {...others} ref={ref} />;
});

if (!env.isProduction) {
  Anchor.displayName = displayName;
  Anchor.propTypes = {};
}

export default Anchor;
