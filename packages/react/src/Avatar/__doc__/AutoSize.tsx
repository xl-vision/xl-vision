import { useState, useCallback } from 'react';
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
  const [index, setIndex] = useState(0);
  const [gapIndex, setGapIndex] = useState(0);

  const handleChangeContent = useCallback(() => {
    setIndex((prev) => (prev + 1) % textArray.length);
  }, []);

  const handleChangeGap = useCallback(() => {
    setGapIndex((prev) => (prev + 1) % textArray.length);
  }, []);

  return (
    <Wrapper>
      <Avatar gap={gapArray[gapIndex]} size='large'>
        {textArray[index]}
      </Avatar>

      <Button onClick={handleChangeContent}>ChangeContent</Button>
      <Button onClick={handleChangeGap}>ChangeGap</Button>
    </Wrapper>
  );
};

export default AutoSize;
