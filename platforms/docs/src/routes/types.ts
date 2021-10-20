import React from 'react';
import layouts from '../../layout';

export type BaseLeftRoute = {
  name: string;
  path: string;
};

export type ComponentLeftRoute = BaseLeftRoute & {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  layout?: keyof typeof layouts;
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
