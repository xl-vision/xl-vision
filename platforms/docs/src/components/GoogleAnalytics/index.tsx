import Script from 'next/script';

const script = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-HJ6F44LG42');`;

const GoogleAnalytics = () => {
  return (
    <>
      <Script
        strategy='afterInteractive'
        src='https://www.googletagmanager.com/gtag/js?id=G-HJ6F44LG42'
      />
      <Script
        id='google-analytics'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{ __html: script }}
      />
    </>
  );
};

export default GoogleAnalytics;
