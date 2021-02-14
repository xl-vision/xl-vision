import { styled } from '@xl-vision/react';
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

const LinkWrapper = styled('a')(
  ({ theme }) => `
  color: ${theme.color.themes.primary.main};
  text-decoration: none;
  transition: ${theme.animation.standard('all')};
  display: inline-block;
  padding: 0 3px;
`,
);

const Link: React.FunctionComponent<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
  // eslint-disable-next-line react/prop-types
  const { href, ...others } = props;

  if (href) {
    if (/^ *\//.exec(href)) {
      // @ts-ignore
      return <LinkWrapper {...others} as={RouteLink} to={href} />;
    }
  }

  return <LinkWrapper {...others} href={href} target='_blank' />;
};

export default Link;
