import { notFound } from 'next/navigation';
import { FC, lazy, useMemo } from 'react';
import { Lang } from '@docs/locales';
import { RouteType } from '@docs/routes';
import { getRouteByName } from '@docs/utils/route';
import Title from './Title';

export type DocsProps = {
  routes: Array<RouteType>;
  name: string;
  lang: Lang;
};

const Docs: FC<DocsProps> = ({ routes, name, lang }) => {
  const route = useMemo(() => getRouteByName(routes, name), [routes, name]);

  const Child = useMemo(() => {
    if (route) {
      return lazy(route.docs);
    }
  }, [route]);

  if (!Child) {
    return notFound();
  }

  const node = Child && <Child />;

  return (
    <>
      <Title>{route!.titleMap[lang]}</Title>
      {node}
    </>
  );
};

export default Docs;
