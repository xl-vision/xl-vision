'use client';

import * as Icons from '@xl-vision/icons';
import { Button, Input, Message, styled } from '@xl-vision/react';
import ClipboardJs from 'clipboard';
import { ComponentType, FC, useState, useCallback, useMemo, MouseEvent } from 'react';
import useLocale from '@docs/hooks/useLocale';

export type IconComponentMap = {
  [key: string]: ComponentType;
};

const keys = Object.keys(Icons);

enum IconType {
  OUTLINED,
  FILLED,
}
const Wrapper = styled('div')(() => {
  return {};
});

const IconWrapper = styled('div')(({ theme }) => {
  const { typography, colors, transitions } = theme;
  return {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 100,
    color: colors.text.primary,
    borderRadius: 5,
    cursor: 'pointer',
    transition: transitions.standard('all'),
    margin: 16,

    svg: {
      ...typography.h3.style,
    },
    div: {
      ...typography.subtitle2.style,
    },
    ':hover': {
      color: colors.themes.primary.text.primary,
      backgroundColor: colors.themes.primary.foreground.hover,
    },
  };
});

const IconSearch: FC<void> = () => {
  const { locale } = useLocale();
  const [iconType, setIconType] = useState<IconType>(IconType.OUTLINED);
  const [message, holder] = Message.useMessage();

  const [search, setSearch] = useState('');

  const handleCopy = useCallback(
    (e: MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const clipboard = new ClipboardJs(target);

      clipboard.on('success', () => {
        clipboard.destroy();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        message.success('Copy success');
      });
    },
    [message],
  );

  const icons = useMemo(() => {
    return keys
      .filter((iconName) => {
        if (iconName === 'createIcon') {
          return false;
        }
        if (iconName.toUpperCase().indexOf(search.toUpperCase()) === -1) {
          return false;
        }
        if (iconType === IconType.OUTLINED) {
          return /Outlined$/.exec(iconName);
        }

        if (iconType === IconType.FILLED) {
          return /Filled$/.exec(iconName);
        }

        return false;
      })
      .map((iconName) => {
        const Comp = (Icons as unknown as IconComponentMap)[iconName];
        return (
          <IconWrapper
            data-clipboard-text={`<${iconName} />`}
            key={iconName}
            onMouseDown={handleCopy}
          >
            <Comp />
            <div>{iconName}</div>
          </IconWrapper>
        );
      });
  }, [iconType, search, handleCopy]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  return (
    <Wrapper>
      {holder}
      <Input.Group style={{ marginBottom: 20 }}>
        <Button
          color={iconType === IconType.OUTLINED ? 'primary' : 'default'}
          onClick={() => setIconType(IconType.OUTLINED)}
        >
          Outlined
        </Button>
        <Button
          color={iconType === IconType.FILLED ? 'primary' : 'default'}
          onClick={() => setIconType(IconType.FILLED)}
        >
          Filled
        </Button>
        <Input
          placeholder={locale.pages.Icons.seachPlaceholder}
          style={{
            flex: 1,
          }}
          value={search}
          onChange={handleSearch}
        />
      </Input.Group>
      <div className='bottom'>{icons}</div>
    </Wrapper>
  );
};

export default IconSearch;
