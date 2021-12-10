import React from 'react';

export default React.createContext<{
  gutter: number;
}>({
  gutter: 0,
});
