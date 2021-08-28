import routesEnUS from './routes.en-US';
import routesZhCN from './routes.zh-CN';
import { Route } from '../types';

const map: Record<string, Array<Route>> = {
  'en-US': routesEnUS,
  'zh-CN': routesZhCN,
};

export default map;
