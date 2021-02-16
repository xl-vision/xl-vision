import React from 'react';

export default React.createContext<{
  matches: Array<string>;
  gutter: number;
}>({
  matches: [],
  gutter: 0,
});
