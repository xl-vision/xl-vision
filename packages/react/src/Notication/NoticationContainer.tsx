import { NoticationContainerProps as InnerNoticationContainerProps } from '@xl-vision/hooks';
import { Children, CSSProperties, FC, useMemo } from 'react';
import Portal, { PortalContainerType } from '../Portal';
import { styled } from '../styles';
import NoticationContext from './context';

export type NoticationPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type NoticationContainerProps = InnerNoticationContainerProps<{
  distance?: number;
  container?: PortalContainerType<HTMLElement>;
  zIndex?: number;
  placement?: NoticationPlacement;
}>;

const displayName = 'NoticationContainer';

const NoticationContainerRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {
    position: 'fixed',
    display: 'flex',
  };
});

const DEFAULT_CONTAINER = () => document.body;

const NoticationContainer: FC<NoticationContainerProps> = ({
  distance = 8,
  container = DEFAULT_CONTAINER,
  children,
  zIndex,
  placement = 'top-right',
}) => {
  const contextValue = useMemo(() => ({ placement }), [placement]);

  if (!Children.count(children)) {
    return null;
  }

  const [direction, position] = placement.split('-');

  const style: CSSProperties = {
    zIndex,
    padding: `${distance}px 20px`,
    flexDirection: direction === 'top' ? 'column' : 'column-reverse',
    textAlign: position === 'left' ? 'right' : 'left',
    [direction]: 0,
    [position]: 0,
  };

  return (
    <Portal container={container}>
      <NoticationContext.Provider value={contextValue}>
        <NoticationContainerRoot style={style}>{children}</NoticationContainerRoot>
      </NoticationContext.Provider>
    </Portal>
  );
};

export default NoticationContainer;
