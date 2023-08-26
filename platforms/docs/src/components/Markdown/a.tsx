import { styled } from '@xl-vision/react';
import NextLink from 'next/link';

const StyledLink = styled(NextLink)(
  ({ theme }) => `
  color: ${theme.colors.themes.primary.foreground.active};
  text-decoration: none;
  transition: ${theme.transitions.standard('all')};
  display: inline-block;
  padding: 0 3px;
  cursor: pointer;
`,
);

const Link: typeof StyledLink = (props) => {
  const { href, ...others } = props;

  if (typeof href === 'string') {
    if (/^ *\//.exec(href)) {
      return <StyledLink {...others} href={href} />;
    }
  }

  return <StyledLink {...others} href={href} target='_blank' />;
};

export default Link;
