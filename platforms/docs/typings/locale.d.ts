declare module '*.mdx?locale' {
  import { ComponentType } from 'react';

  const component: ComponentType;
  export default component;
}
