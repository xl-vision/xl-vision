declare module '*.mdx?locale' {
  import { LocaleComponentMap } from '@docs/components/Docs';

  const map: LocaleComponentMap;
  export default map;
}
