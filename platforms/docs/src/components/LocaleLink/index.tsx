import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, ReactNode, forwardRef } from 'react';
import useLocale from '@docs/hooks/useLocale';
import { join } from '@docs/utils/link';

export type LocaleLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: ReactNode;
  };

const LocaleLink = forwardRef<HTMLAnchorElement, LocaleLinkProps>(({ href, ...others }, ref) => {
  const { lang } = useLocale();

  const newHref =
    typeof href === 'object'
      ? { ...href, href: href.href ? join('/', lang, href.href) : null }
      : join('/', lang, href);

  return <Link {...others} href={newHref} ref={ref} />;
});

export default LocaleLink;
