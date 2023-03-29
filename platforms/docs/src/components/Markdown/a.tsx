import { styled } from '@xl-vision/react';
import NextLink from 'next/link';
import { FC, AnchorHTMLAttributes } from 'react';

const LinkWrapper = styled('a')(
  ({ theme }) => `
  color: ${theme.colors.themes.primary.foreground.enabled};
  text-decoration: none;
  transition: ${theme.transitions.standard('all')};
  display: inline-block;
  padding: 0 3px;
  cursor: pointer;
`,
);

const Link: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
  const { href, ...others } = props;

  if (href) {
    if (/^ *\//.exec(href)) {
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
