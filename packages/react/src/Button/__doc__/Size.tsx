import React from 'react';
import { Button, ButtonSize, Icon, styled } from '@xl-vision/react';
import SearchOutlined from '@xl-vision/icons/SearchOutlined';

const IconWrapper = (
  <Icon>
    <SearchOutlined />
  </Icon>
);

const Wrapper = styled('div')(() => {
  return {
    'button, a': {
      marginRight: 10,
      marginBottom: 10,
    },
  };
});

export default () => {
  const [size, setSize] = React.useState<ButtonSize>('middle');

  const handleSizeChange = React.useCallback(() => {
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
      <Button onClick={handleSizeChange} size={size}>
        change size
      </Button>
      <Button variant='text' theme='primary' size={size}>
        button
      </Button>
      <Button variant='outlined' theme='secondary' size={size}>
        button
      </Button>
      <Button variant='text' theme='error' size={size}>
        button
      </Button>
      <Button theme='warning' size={size}>
        button
      </Button>
      <Button round={true} theme='primary' size={size}>
        button
      </Button>
      <Button theme='primary' size={size} prefixIcon={IconWrapper} />
      <Button theme='primary' size={size} suffixIcon={IconWrapper} />
      <Button round={true} theme='primary' size={size} prefixIcon={IconWrapper} />
    </Wrapper>
  );
};
