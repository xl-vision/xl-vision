import { Button, ComponentSize, styled } from '@xl-vision/react';
import { SearchOutlined } from '@xl-vision/icons';
import { useState, useCallback } from 'react';

const IconWrapper = <SearchOutlined />;

const Wrapper = styled('div')(() => {
  return {
    'button, a': {
      marginRight: 10,
      marginBottom: 10,
    },
  };
});

const Size = () => {
  const [size, setSize] = useState<ComponentSize>('middle');

  const handleSizeChange = useCallback(() => {
    setSize((prev) => {
      if (prev === 'middle') {
        return 'large';
      }
      if (prev === 'large') {
        return 'small';
      }
      return 'middle';
    });
  }, []);

  return (
    <Wrapper>
      <Button size={size} onClick={handleSizeChange}>
        change size
      </Button>
      <Button color='primary' size={size} variant='text'>
        button
      </Button>
      <Button color='secondary' size={size} variant='outlined'>
        button
      </Button>
      <Button color='error' size={size} variant='text'>
        button
      </Button>
      <Button color='warning' size={size}>
        button
      </Button>
      <Button color='primary' round={true} size={size}>
        button
      </Button>
      <Button color='primary' prefixIcon={IconWrapper} size={size} />
      <Button color='primary' size={size} suffixIcon={IconWrapper} />
      <Button color='primary' prefixIcon={IconWrapper} round={true} size={size} />
    </Wrapper>
  );
};

export default Size;
