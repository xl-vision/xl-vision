import React from 'react';

export type BaseLeftRoute = {
  name: string;
  path: string;
};

export type ComponentLeftRoute = BaseLeftRoute & {
  component: () => Promise<{ default: React.ComponentType<any> }>;
};

export type RedirectLeftRoute = BaseLeftRoute & {
  redirect: string;
};

export type LeafRoute = ComponentLeftRoute | RedirectLeftRoute;

export type NonLeafRoute = {
  name: string;
  children: Array<Route>;
};

export type Route = LeafRoute | NonLeafRoute;
