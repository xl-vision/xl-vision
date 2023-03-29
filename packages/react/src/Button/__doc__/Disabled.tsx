import { SearchOutlined } from '@xl-vision/icons';
import { Button, styled } from '@xl-vision/react';

const IconWrapper = <SearchOutlined />;

const Wrapper = styled('div')(() => {
  return {
    'button, a': {
      marginRight: 10,
      marginBottom: 10,
    },
  };
});

const Disabled = () => {
  return (
    <Wrapper>
      <Button disabled={true}>button</Button>
      <Button color='primary' disabled={true}>
        button
      </Button>
      <Button color='error' disabled={true}>
        button
      </Button>
      <Button color='warning' disabled={true} round={true}>
        button
      </Button>
      <Button color='primary' disabled={true} prefixIcon={IconWrapper}>
        button
      </Button>
    </Wrapper>
  );
};

export default Disabled;
