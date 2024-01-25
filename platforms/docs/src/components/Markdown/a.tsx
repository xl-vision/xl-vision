'use client';

import { styled } from '@xl-vision/react';
import NextLink from 'next/link';
import { AnchorHTMLAttributes, FC, useMemo } from 'react';
import useLocale from '@docs/hooks/useLocale';

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

const Link: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
  const { href, ...others } = props;

  const { lang } = useLocale();

  const newHref = useMemo(() => {
    if (href && /^\//.test(href)) {
      return `${lang}${href}`;
    }
    return href || '';
  }, [href, lang]);

  return <StyledLink {...others} href={newHref} target='_blank' />;
};

export default Link;
