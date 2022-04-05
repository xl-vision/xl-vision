import { Anchor } from '@xl-vision/react';
import React from 'react';

const Demo = () => {
  return (
    <Anchor affix={true} offsetTop={50}>
      <Anchor.Link href='#Examples' title='Examples'>
        <Anchor.Link href='#Fixedposition' title='Fixed position' />
        <Anchor.Link href='#Notfixedposition' title='Not fixed position' />
        <Anchor.Link href='#Setoffset' title='Set Offset' />
      </Anchor.Link>
      <Anchor.Link href='#AnchorAPI' title='Anchor API' />
      <Anchor.Link href='#AnchorLinkAPI' title='AnchorLink API' />
    </Anchor>
  );
};

export default Demo;
