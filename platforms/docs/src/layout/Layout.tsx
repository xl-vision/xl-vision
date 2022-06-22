import React from 'react';

export type LayoutProps = {
  children: React.ReactNode;
};

export type Layout<T extends LayoutProps = LayoutProps> = React.FC<T>;
