import Negotiator from 'negotiator';
import { NextResponse, NextRequest } from 'next/server';
import { defaultLang, supportedLangs } from './locales';

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (supportedLangs.some((lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`)) {
    return NextResponse.next();
  }

  const headers: Negotiator.Headers = {};

  request.headers.forEach((v, k) => {
    headers[k] = v;
  });

  const negotiator = new Negotiator({ headers });

  const lang = negotiator.language(supportedLangs as unknown as Array<string>) || defaultLang;

  request.nextUrl.pathname = `/${lang}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
};

export const config = {
  matcher: ['/((?!_next|favicon.png|robots.txt|sitemap|img/).*)'],
};
