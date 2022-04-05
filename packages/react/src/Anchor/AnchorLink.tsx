import { env } from '@xl-vision/utils';
import React from 'react';
import { useConstantFn } from '@xl-vision/hooks';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled } from '../styles';
import AnchorContext from './AnchorContext';
import { useTheme } from '../ThemeProvider';

export type AnchorLinkProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: React.ReactNode;
  href: string;
};

const displayName = 'AnchorLink';

const AnchorLinkRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {
    padding: '4px 0 4px 12px',
    lineHeight: 1,
  };
});

const AnchorLinkTitle = styled('a', {
  name: displayName,
  slot: 'title',
})<{ isActive: boolean }>(({ theme, styleProps }) => {
  const { color, typography, transition } = theme;

  const { isActive } = styleProps;

  return {
    ...typography.subtitle2.style,
    color: isActive ? color.themes.primary.color : color.text.primary,
    textDecoration: 'none',
    display: 'block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    transition: transition.standard('color'),

    '&:hover': {
      color: color.themes.primary.color,
    },
  };
});

const AnchorLink = React.forwardRef<HTMLDivElement, AnchorLinkProps>((props, ref) => {
  const { clsPrefix } = useTheme();

  const { title, href, className, children, ...others } = props;

  const { activeLink, registerLink, unregisterLink, scrollTo } = React.useContext(AnchorContext);

  const handleClick = useConstantFn(() => {
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

  const titleClassName = `${rootClassName}__title`;
  const titleClasses = clsx(titleClassName, {
    [`${titleClassName}--active`]: isActive,
  });

  return (
    <AnchorLinkRoot {...others} className={rootClasses} ref={ref}>
      <AnchorLinkTitle
        styleProps={{ isActive }}
        title={typeof title === 'string' ? title : ''}
        className={titleClasses}
        onClick={handleClick}
        href={href}
      >
        {title}
      </AnchorLinkTitle>
      {children}
    </AnchorLinkRoot>
  );
});

if (!env.isProduction) {
  AnchorLink.displayName = displayName;
  AnchorLink.propTypes = {
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node,
  };
}

export default AnchorLink;
