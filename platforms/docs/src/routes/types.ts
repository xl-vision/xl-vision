import React from 'react';

export type LeafRoute = {
  name: string;
  path: string;
  component?: () => Promise<{ default: React.ComponentType<any> }>;
};

export type NonLeafRoute = {
  name: string;
  children: Array<Route>;
};

export type Route = LeafRoute | NonLeafRoute;
