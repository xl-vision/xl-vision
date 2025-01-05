'use client';
import * as React from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { FC } from 'react';

export type StyleComponentRegistryProps = {
  children: React.ReactNode;
};

/**
 * Emotion works OK without this provider but it's recommended to use this provider to improve performance.
 * Without it, Emotion will generate a new <style> tag during SSR for every component.
 * See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153 for why it's a problem.
 */
const StyleComponentRegistry: FC<StyleComponentRegistryProps> = ({children}: StyleComponentRegistryProps) => {
  const [registry] = React.useState(() => {
    const cache = createCache({ key: 'xl' });
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: { name: string; isGlobal: boolean }[] = [];
    // Override the insert method to support streaming SSR with flush().
    // @ts-expect-error
    cache.insert = (...args) => {
      const [selector, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({
          name: serialized.name,
          isGlobal: !selector,
        });
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const inserted = registry.flush();
    if (inserted.length === 0) {
      return null;
    }
    let styles = '';
    let dataEmotionAttribute = registry.cache.key;

    const globals: {
      name: string;
      style: string;
    }[] = [];

    inserted.forEach(({ name, isGlobal }) => {
      const style = registry.cache.inserted[name];

      if (typeof style === 'string') {
        if (isGlobal) {
          globals.push({ name, style });
        } else {
          styles += style;
          dataEmotionAttribute += ` ${name}`;
        }
      }
    });

    return (
      <>
        {globals.map(({ name, style }) => (
          <style
            key={name}
            data-emotion={`${registry.cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        ))}
        {styles && (
          <style
            data-emotion={dataEmotionAttribute}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        )}
      </>
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}

export default StyleComponentRegistry
