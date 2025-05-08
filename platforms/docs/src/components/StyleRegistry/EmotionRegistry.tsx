'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import * as React from 'react';
import { FC } from 'react';

export type EmotionRegistryProps = {
  children: React.ReactNode;
};

const EmotionRegistry: FC<EmotionRegistryProps> = ({ children }: EmotionRegistryProps) => {
  const [registry] = React.useState(() => {
    const cache = createCache({ key: 'xl' });
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: Array<{ name: string; isGlobal: boolean }> = [];
    // Override the insert method to support streaming SSR with flush().
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

    const globals: Array<{
      name: string;
      style: string;
    }> = [];

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
            dangerouslySetInnerHTML={{ __html: style }}
            data-emotion={`${registry.cache.key}-global ${name}`}
            key={name}
          />
        ))}
        {styles && (
          <style dangerouslySetInnerHTML={{ __html: styles }} data-emotion={dataEmotionAttribute} />
        )}
      </>
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
};

export default EmotionRegistry;
