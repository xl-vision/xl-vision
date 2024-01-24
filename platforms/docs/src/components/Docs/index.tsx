'use client';

import { Anchor, Row } from '@xl-vision/react';
import { FC, ReactNode } from 'react';
import useLocale from '@docs/hooks/useLocale';
import { Lang, defaultLang } from '@docs/locales';
import useIsDebugMode from '../../hooks/useIsDebugMode';
import { HEADER_HEIGHT } from '../Header';

export type LocaleComponentMap = Record<Lang, { node: ReactNode; outline: Outline }>;

export type DocsProps = {
  docs: LocaleComponentMap;
};

export type Outline = Array<{
  children: Outline;
  id: string;
  title: string;
  debug?: boolean;
}>;

const Docs: FC<DocsProps> = ({ docs }) => {
  const { lang } = useLocale();

  const docsInfo = docs[lang] || docs[defaultLang];

  const { node, outline } = docsInfo;

  const isDebugMode = useIsDebugMode();

  const outlineNodes = genMenus(outline, isDebugMode);

  return (
    <Row removeOnUnvisible={true}>
      <Row.Col column={{ xs: 24, lg: 20, xxl: 21 }}>{node}</Row.Col>
      <Row.Col column={{ xs: 0, lg: 4, xxl: 3 }}>
        {outlineNodes && (
          <Anchor offsetTop={HEADER_HEIGHT + 20} targetOffset={HEADER_HEIGHT}>
            {outlineNodes}
          </Anchor>
        )}
      </Row.Col>
    </Row>
  );
};

export default Docs;

const genMenus = (outline: Outline, isDebugMode: boolean) => {
  if (!isDebugMode) {
    outline = outline.filter((it) => !it.debug);
  }

  if (!outline || !outline.length) {
    return null;
  }

  return outline.map((it) => (
    <Anchor.Link href={`#${it.id}`} key={it.id} title={it.title}>
      {genMenus(it.children || [], isDebugMode)}
    </Anchor.Link>
  ));
};
