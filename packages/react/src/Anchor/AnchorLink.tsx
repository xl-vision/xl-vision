import { useConstantFn } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { HTMLAttributes, ReactNode, forwardRef, useContext, useEffect } from 'react';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';
import AnchorContext from './AnchorContext';

export type AnchorLinkProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: ReactNode;
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

const AnchorLink = forwardRef<HTMLDivElement, AnchorLinkProps>((props, ref) => {
  const { clsPrefix } = useTheme();

  const { title, href, className, children, ...others } = props;

  const { activeLink, registerLink, unregisterLink, scrollTo } = useContext(AnchorContext);

  const handleClick = useConstantFn(() => {
    scrollTo(href);
  });

  useEffect(() => {
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
        className={titleClasses}
        href={href}
        styleProps={{ isActive }}
        title={typeof title === 'string' ? title : ''}
        onClick={handleClick}
      >
        {title}
      </AnchorLinkTitle>
      {children}
    </AnchorLinkRoot>
  );
});

if (!isProduction) {
  AnchorLink.displayName = displayName;
  AnchorLink.propTypes = {
    href: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
  };
}

export default AnchorLink;
