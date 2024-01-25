import { notFound } from 'next/navigation';
import { FC, lazy, useMemo } from 'react';
import { RouteType } from '@docs/routes';
import { getRouteByName } from '@docs/utils/route';

export type DocsProps = {
  routes: Array<RouteType>;
  name: string;
};

const Docs: FC<DocsProps> = ({ routes, name }) => {
  const Child = useMemo(() => {
    const route = getRouteByName(routes, name);
    if (route) {
      return lazy(route.docs);
    }
  }, [routes, name]);

  if (!Child) {
    return notFound();
  }

  const node = Child && <Child />;

  return node;
};

export default Docs;
