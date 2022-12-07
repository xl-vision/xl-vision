import { styled, Portal } from '@xl-vision/react';
import { useRef, useEffect, useCallback, MouseEvent } from 'react';
import { usePopper, ReferenceRect } from '@xl-vision/popper';

const getContainer = () => document.body;

const Demo = () => {
  const { x, y, update, reference, popper, mode } = usePopper({
    mode: 'absolute',
    placement: 'top',
  });

  const referenceRectRef = useRef<ReferenceRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    reference({
      getBoundingClientRect: () => referenceRectRef.current,
    });
  }, [reference]);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      referenceRectRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: 0,
        height: 0,
      };
      update();
    },
    [update],
  );

  const style = {
    position: mode,
    top: 0,
    left: 0,
    transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  return (
    <DemoRoot onMouseMove={handleMouseMove}>
      <Portal container={getContainer}>
        <PortalContent ref={popper} style={style}>
          Lorem ipsum dolor sit amet.
        </PortalContent>
      </Portal>
    </DemoRoot>
  );
};

export default Demo;

const DemoRoot = styled('div')(({ theme }) => {
  const { color } = theme;
  return {
    position: 'relative',
    height: 200,
    overflow: 'auto',
    backgroundColor: color.background.default,
  };
});

const PortalContent = styled('div')(({ theme }) => {
  const { color } = theme;
  const baseColor = color.mode === 'dark' ? color.modes.light : color.modes.dark;

  return {
    padding: 8,
    borderRadius: 4,
    maxWidth: 100,
    color: baseColor.text.primary,
    backgroundColor: color.emphasize(baseColor.background.paper, 0.1),
  };
});
