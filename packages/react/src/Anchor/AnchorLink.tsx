import { env } from '@xl-vision/utils';
import React from 'react';
import { useConstantFn } from '@xl-vision/hooks';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled } from '../styles';
import AnchorContext from './AnchorContext';
import { useTheme } from '../ThemeProvider';

export type AnchorLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  title: string;
  href: string;
};

const displayName = 'AnchorLink';

const Root = styled('a', {
  name: displayName,
  slot: 'Root',
})<{ isActive: boolean }>(() => {
  return {};
});

const AnchorLink = React.forwardRef<HTMLAnchorElement, AnchorLinkProps>((props, ref) => {
  const { clsPrefix } = useTheme();

  const { title, href, onClick, className, ...others } = props;

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

  const isActive = activeLink === href;

  const rootClassName = `${clsPrefix}-anchor-link`;

  const rootClasses = clsx(
    rootClassName,
    {
      [`${rootClassName}--active`]: isActive,
    },
    className,
  );

  return (
    <Root
      {...others}
      styleProps={{ isActive }}
      className={rootClasses}
      onClick={handleClick}
      ref={ref}
    >
      {title}
    </Root>
  );
});

if (!env.isProduction) {
  AnchorLink.displayName = displayName;
  AnchorLink.propTypes = {
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
  };
}

export default AnchorLink;
