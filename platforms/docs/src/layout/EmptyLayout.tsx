import React from 'react';

export type EmptyLayoutProps = {
  children: React.ReactNode;
};

const EmptyLayout: React.FunctionComponent<EmptyLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default EmptyLayout;
