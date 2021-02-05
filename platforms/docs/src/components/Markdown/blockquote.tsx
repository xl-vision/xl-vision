import { styled } from '@xl-vision/react';

export default styled('blockquote')`
  margin: 1rem 0;
  padding: 0.25rem 0 0.25rem 1rem;
  line-height: 2;
  background-color: rgba(0, 0, 0, 0.05);
  border-left: 4px solid rgba(0, 0, 0, 0.2);

  p {
    margin: 0;
  }

  & + & {
    margin-top: -1rem;
  }
`;
