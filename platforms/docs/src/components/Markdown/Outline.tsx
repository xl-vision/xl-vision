import React from 'react';

export type OutlineProps = {
  value: any;
};

const Outline: React.FunctionComponent<OutlineProps> = ({ value }) => {
  console.log(value);
  return <div>outline</div>;
};

export default Outline;
