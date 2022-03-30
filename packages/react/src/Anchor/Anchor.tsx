import { env } from '@xl-vision/utils';
import React from 'react';
import Affix, { AffixIntance, AffixProps } from '../Affix';
import { styled } from '../styles';

export type AnchorProps = AffixProps & {
  affix?: boolean;
};

const displayName = 'Anchor';

const Root = styled('div', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {};
});

const Anchor = React.forwardRef<AffixIntance, AnchorProps>((props, ref) => {
  const { affix = true, ...others } = props;

  const [links, setLinks] = React.useState<Array<string>>([]);

  const registerLink = React.useCallback((link: string) => {
    setLinks((prev) => [...prev, link]);
  }, []);

  const unregisterLink = React.useCallback((link: string) => {
    setLinks((prev) => prev.filter((it) => it !== link));
  }, []);

  if (affix) {
    return <Affix {...others} ref={ref} />;
  }
  return <div {...others}></div>;
});

if (!env.isProduction) {
  Anchor.displayName = displayName;
  Anchor.propTypes = {};
}

export default Anchor;
