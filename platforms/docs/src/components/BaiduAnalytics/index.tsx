import React from 'react';
import Script from 'next/script';

const BaiduAnalytics: React.FC = () => {
  return (
    <Script
      id='baidu-analytics'
      src='https://hm.baidu.com/hm.js?f8befb1d0df5c99624a66291ce9cf662'
    />
  );
};

export default BaiduAnalytics;
