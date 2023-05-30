import { NextResponse, NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export const middleware = (request: NextRequest) => {
  const pathname = request.nextUrl;

  console.log(pathname);

  return NextResponse.redirect(new URL('/home', request.url));
};

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
