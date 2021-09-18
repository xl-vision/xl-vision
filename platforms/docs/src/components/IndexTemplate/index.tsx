import { styled } from '@xl-vision/react';
import React from 'react';

export type IndexTemplateProps = {};

const Root = styled('div')(() => {
  return {
    textAlign: 'center',
  };
});

const Main = styled('div')(() => {
  return {};
});

const IndexTemplate: React.FunctionComponent<IndexTemplateProps> = (props) => {
  const {} = props;

  return (
    <Root>
      <Main>111</Main>
    </Root>
  );
};

export default IndexTemplate;
