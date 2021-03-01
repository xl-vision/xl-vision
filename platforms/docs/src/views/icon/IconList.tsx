import React from 'react';
import * as Icons from '@xl-vision/icons';
import { styled } from '@xl-vision/react';
import metadata from '../../../../../packages/icons/metadata.json';

const names: Array<string> = [];

// Object.keys(metadata).forEach((key) => {
//   const list = metadata[key as keyof typeof metadata];
//   names.push(...list);
// });

metadata.action.forEach((name) => {
  names.push(name);
});

const IconWrapper = styled('div')(() => {
  return {
    display: 'inline-block',
    width: 50,
    height: 50,
  };
});

const IconList: React.FunctionComponent<{}> = () => {
  return (
    <div>
      {names
        .filter((it) => it !== 'createIcon')
        .map((name) => {
          const Icon = Icons[name as keyof Omit<typeof Icons, 'createIcon'>];
          return (
            <IconWrapper key={name} dataset-name={name}>
              <Icon />
            </IconWrapper>
          );
        })}
    </div>
  );
};

export default IconList;
