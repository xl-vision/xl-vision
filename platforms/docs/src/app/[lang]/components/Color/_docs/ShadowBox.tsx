'use client';

import { styled, useTheme } from '@xl-vision/react';

const ShadowBox = () => {
  const { elevations } = useTheme();

  return (
    <Root>
      {elevations.map((it, index) => (
        <Box key={it} style={{ boxShadow: it }}>
          Level{index}
        </Box>
      ))}
    </Root>
  );
};

export default ShadowBox;

const Box = styled('div')(({ theme: { colors } }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    margin: 8,
    backgroundColor: colors.background.paper,
  };
});

const Root = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  };
});
