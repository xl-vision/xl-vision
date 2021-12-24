import React from 'react';
import { Avatar, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(() => {
  return {
    '>*': {
      margin: 4,
    },
  };
});

const textArray = ['Tom', 'Green', 'U', 'xl-vision'];

const gapArray = [1, 2, 3, 4, 5];

const AutoSize = () => {
  const [index, setIndex] = React.useState(0);
  const [gapIndex, setGapIndex] = React.useState(0);

  const handleChangeContent = React.useCallback(() => {
    setIndex((prev) => (prev + 1) % textArray.length);
  }, []);

  const handleChangeGap = React.useCallback(() => {
    setGapIndex((prev) => (prev + 1) % textArray.length);
  }, []);

  return (
    <Wrapper>
      <Avatar size='large' gap={gapArray[gapIndex]}>
        {textArray[index]}
      </Avatar>

      <Button onClick={handleChangeContent}>ChangeContent</Button>
      <Button onClick={handleChangeGap}>ChangeGap</Button>
    </Wrapper>
  );
};

export default AutoSize;
