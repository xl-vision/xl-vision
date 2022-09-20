import { Anchor } from '@xl-vision/react';

const Demo = () => {
  return (
    <Anchor>
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
