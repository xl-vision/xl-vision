import { styled } from '@xl-vision/react';
import React from 'react';
import NextLink from 'next/link';

const LinkWrapper = styled('a')(
  ({ theme }) => `
  color: ${theme.color.themes.primary.color};
  text-decoration: none;
  transition: ${theme.transition.standard('all')};
  display: inline-block;
  padding: 0 3px;
  cursor: pointer;
`,
);

const Link: React.FunctionComponent<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
  const { href, ...others } = props;

  if (href) {
    if (/^ *\//.exec(href)) {
      // @ts-ignore
      return (
        <NextLink href={href} passHref={true}>
          <LinkWrapper {...others} />
        </NextLink>
      );
    }
  }

  return <LinkWrapper {...others} href={href} target='_blank' />;
};

export default Link;
