import { Anchor } from '@xl-vision/react';

const Demo = () => {
  return (
    <Anchor>
      <Anchor.Link href='#shili' title='示例'>
        <Anchor.Link href='#gudingweizhi' title='固定位置' />
        <Anchor.Link href='#bugudingweizhi' title='不固定位置' />
        <Anchor.Link href='#shezhipianyiliang' title='设置偏移量' />
      </Anchor.Link>
      <Anchor.Link href='#AnchorAPI' title='Anchor API' />
      <Anchor.Link href='#AnchorLinkAPI' title='AnchorLink API' />
    </Anchor>
  );
};

export default Demo;
