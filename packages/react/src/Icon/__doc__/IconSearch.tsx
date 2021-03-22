import React from 'react';
import * as Icons from '@xl-vision/icons';
import { Button, Icon, styled } from '@xl-vision/react';
import ClipboardJs from 'clipboard';

export type IconComponentMap = {
  [key: string]: React.ComponentType;
};

const keys = Object.keys(Icons);

enum IconType {
  OUTLINED,
  FILLED,
}
const Wrapper = styled('div')(({ theme }) => {
  const { color, typography } = theme;
  return {
    '.top': {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 26,
      '.left': {
        marginRight: 16,
        button: {
          ':not(:last-child)': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
          ':not(:first-child)': {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
        },
      },
      input: {
        display: 'inline-block',
        flex: 1,
        outline: 'none',
        border: `1px solid ${color.divider}`,
        padding: '8px',
        borderRadius: 4,
        ...typography.body2,
      },
    },
  };
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
      ...typography.h3,
    },
    div: {
      ...typography.subtitle2,
    },
    ':hover': {
      color: color.themes.primary.text.primary,
      backgroundColor: color.themes.primary.color,
    },
  };
});

const IconSearch: React.FunctionComponent<void> = () => {
  const [iconType, setIconType] = React.useState<IconType>(IconType.OUTLINED);

  const [search, setSearch] = React.useState('');

  const handleCopy = React.useCallback((e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLDivElement;
    const clipboard = new ClipboardJs(target);

    clipboard.on('success', () => {
      clipboard.destroy();
      // eslint-disable-next-line no-alert
      alert('复制成功');
    });
  }, []);

  const icons = React.useMemo(() => {
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
        const Comp = ((Icons as unknown) as IconComponentMap)[iconName];
        return (
          <IconWrapper
            key={iconName}
            onMouseDown={handleCopy}
            data-clipboard-text={`<Icon><${iconName} /></Icon>`}
          >
            <Icon>
              <Comp />
            </Icon>
            <div>{iconName}</div>
          </IconWrapper>
        );
      });
  }, [iconType, search, handleCopy]);

  const handleSearch = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  return (
    <Wrapper>
      <div className='top'>
        <div className='left'>
          <Button
            theme={iconType === IconType.OUTLINED ? 'primary' : 'default'}
            onClick={() => setIconType(IconType.OUTLINED)}
          >
            Outlined
          </Button>
          <Button
            theme={iconType === IconType.FILLED ? 'primary' : 'default'}
            onClick={() => setIconType(IconType.FILLED)}
          >
            Filled
          </Button>
        </div>
        <input value={search} onChange={handleSearch} placeholder='在此搜索图标' />
      </div>
      <div className='bottom'>{icons}</div>
    </Wrapper>
  );
};

export default IconSearch;
