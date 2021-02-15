import React from 'react';

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  // offset?: ColSpanType;
  // order?: ColSpanType;
  // pull?: ColSpanType;
  // push?: ColSpanType;
  // span: ColSpanType;
}

const Col: React.FunctionComponent<ColProps> = (props) => {
  const { children } = props;

  return <div>{children}</div>;
};

export default Col;
