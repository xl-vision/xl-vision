import React from 'react';

export default React.createContext<{
  breakPoints: Array<[string, boolean]>;
  gutter: number;
}>({
  breakPoints: [],
  gutter: 0,
});
