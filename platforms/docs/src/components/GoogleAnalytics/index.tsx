'use client';

import Script from 'next/script';

const script = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-HJ6F44LG42');`;

const GoogleAnalytics = () => {
  return (
    <>
      <Script
        src='https://www.googletagmanager.com/gtag/js?id=G-HJ6F44LG42'
        strategy='afterInteractive'
      />
      <Script
        dangerouslySetInnerHTML={{ __html: script }}
        id='google-analytics'
        strategy='afterInteractive'
      />
    </>
  );
};

export default GoogleAnalytics;
