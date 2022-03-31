import { env } from '@xl-vision/utils';
import React from 'react';
import { useConstantFn } from '@xl-vision/hooks';
import { styled } from '../styles';
import AnchorContext from './AnchorContext';

export type AnchorLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  title: string;
  href: string;
};

const displayName = 'AnchorLink';

const Root = styled('a', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {};
});

const AnchorLink = React.forwardRef<HTMLAnchorElement, AnchorLinkProps>((props, ref) => {
  const { title, href, onClick, ...others } = props;

  const { activeLink, registerLink, unregisterLink, scrollTo } = React.useContext(AnchorContext);

  const handleClick = useConstantFn((e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    scrollTo(href);
  });

  React.useEffect(() => {
    registerLink(href);
    return () => {
      unregisterLink(href);
    };
  }, [registerLink, unregisterLink, href]);

  return (
    <Root {...others} ref={ref} onClick={handleClick}>
      {title}
    </Root>
  );
});

if (!env.isProduction) {
  AnchorLink.displayName = displayName;
  AnchorLink.propTypes = {};
}

export default AnchorLink;
