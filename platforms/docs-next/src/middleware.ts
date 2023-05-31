import Negotiator from 'negotiator';
import { NextResponse, NextRequest } from 'next/server';
import { defaultLang, supportedLangs } from './locales';

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (supportedLangs.some((lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`)) {
    return NextResponse.next();
  }

  const headers: Record<string, any> = {};

  request.headers.forEach((v, k) => {
    headers[k] = v;
  });

  const negotiator = new Negotiator({ headers });

  const lang = negotiator.language(supportedLangs) || defaultLang;

  return NextResponse.redirect(new URL(`/${lang}${pathname === '/' ? '' : pathname}`, request.url));
};

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    '/((?!favicon\\.svg))',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
