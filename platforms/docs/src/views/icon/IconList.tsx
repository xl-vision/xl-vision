import React from 'react';
import * as Icons from '@xl-vision/icons';
import metadata from '../../../../../packages/icons/metadata.json';

const names: Array<string> = [];

Object.keys(metadata).forEach((key) => {
  const list = metadata[key as keyof typeof metadata];
  names.push(...list);
});

const IconList: React.FunctionComponent<{}> = () => {
  return (
    <div>
      {names.map((name) => {
        const Icon = Icons[name as keyof typeof Icons];
        return <Icon key={name} />;
      })}
    </div>
  );
};

export default IconList;
