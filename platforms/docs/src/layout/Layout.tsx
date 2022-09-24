import { FC, ReactNode } from 'react';

export type LayoutProps = {
  children: ReactNode;
};

export type Layout<T extends LayoutProps = LayoutProps> = FC<T>;
