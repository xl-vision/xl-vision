import * as Icons from '@xl-vision/icons';
import { Button, Input, styled } from '@xl-vision/react';
import ClipboardJs from 'clipboard';
import { ComponentType, FC, useState, useCallback, useMemo } from 'react';
import { useLocale } from '../../../components/LocalizationProvider';

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
  const { typography, color, transition } = theme;
  return {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 100,
    color: color.text.primary,
    borderRadius: 5,
    cursor: 'pointer',
    transition: transition.standard('all'),
    margin: 16,

    svg: {
      ...typography.h3.style,
    },
    div: {
      ...typography.subtitle2.style,
    },
    ':hover': {
      color: color.themes.primary.text.primary,
      backgroundColor: color.themes.primary.color,
    },
  };
});

const IconSearch: FC<void> = () => {
  const { locale } = useLocale();
  const [iconType, setIconType] = useState<IconType>(IconType.OUTLINED);

  const [search, setSearch] = useState('');

  const handleCopy = useCallback((e: MouseEvent) => {
    const target = e.currentTarget as HTMLDivElement;
    const clipboard = new ClipboardJs(target);

    clipboard.on('success', () => {
      clipboard.destroy();
      // eslint-disable-next-line no-alert
      alert('Copy success');
    });
  }, []);

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
            key={iconName}
            onMouseDown={handleCopy}
            data-clipboard-text={`<${iconName} />`}
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
          style={{
            flex: 1,
          }}
          value={search}
          onChange={handleSearch}
          placeholder={locale.pages.Icons.seachPlaceholder}
        />
      </Input.Group>
      <div className='bottom'>{icons}</div>
    </Wrapper>
  );
};

export default IconSearch;
