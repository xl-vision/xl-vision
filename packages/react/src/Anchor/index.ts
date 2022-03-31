import Anchor from './Anchor';
import AnchorLink from './AnchorLink';

export { default as Anchor } from './Anchor';
export { default as AnchorLink } from './AnchorLink';
export * from './Anchor';
export * from './AnchorLink';

const obj = Anchor as typeof Anchor & {
  Link: typeof AnchorLink;
};

obj.Link = AnchorLink;

export default obj;
