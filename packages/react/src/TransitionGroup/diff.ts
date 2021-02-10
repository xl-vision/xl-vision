import { warning } from '../commons/utils/logger';

export type Data<T extends React.ReactElement> = {
  prev: Array<T>;
  next: Array<T>;
  same?: boolean;
};

/**
 * 比较前后数组，生成一个新的数组结构
 * 比较规则：
 * 1、所有比较都是基于key进行的
 * 2、节点位置发生变化的，则是以后面的数组位置为准，且内容也以后面的为准
 * 3、前后对比，节点被删除的，需要做删除标记，位置不变
 * 4、前后对比，节点是添加的，需要做添加标记，位置不变
 * 5、前后对比，相同位置上，原节点删除，新节点添加，需要标记为替换，位置不变
 */
export default <T extends React.ReactElement>(prevChildren: Array<T>, nextChildren: Array<T>) => {
  const quene: Array<Data<T>> = [];

  // 记录前后都存在的key
  const sameKeyObj = Object.create(null) as {
    [key: string]: {
      prevIndex: number;
      nextIndex: number;
    };
    [key: number]: {
      prevIndex: number;
      nextIndex: number;
    };
  };

  for (let i = 0; i < prevChildren.length; i++) {
    const prev = prevChildren[i];
    const prevKey = prev.key;
    warning(!prevKey, '<TransitioGroup> must has a key');
    for (let j = 0; j < nextChildren.length; j++) {
      const next = nextChildren[j];
      warning(!next.key, '<TransitioGroup> must has a key');
      if (prev.key === next.key) {
        sameKeyObj[prevKey!] = {
          prevIndex: i,
          nextIndex: j,
        };
        break;
      }
    }
  }

  let prevPendingArray: Array<T> = [];
  let nextPendingArray: Array<T> = [];

  const sameKeys = Object.keys(sameKeyObj);

  let i = 0;
  let j = 0;
  // 由于prevObj和nextObj中no的数量相同，
  while (i < prevChildren.length && j < nextChildren.length) {
    const prev = prevChildren[i];
    const next = nextChildren[j];
    const isPrevExist = sameKeys.includes(prev.key!.toString());
    const isNextExist = sameKeys.includes(next.key!.toString());

    // prev存在，next也存在，
    if (isPrevExist && isNextExist) {
      // 1. 保存prevPendingArray和nextPendingArray并清空
      if (prevPendingArray.length > 0 || nextPendingArray.length > 0) {
        quene.push({
          prev: prevPendingArray,
          next: nextPendingArray,
        });
        prevPendingArray = [];
        nextPendingArray = [];
      }
      // 2. i++,j++，保存记录，
      // 找到和next相同key的prev
      const { prevIndex } = sameKeyObj[next.key!];
      quene.push({
        prev: [prevChildren[prevIndex]],
        next: [next],
        same: true,
      });
      i++;
      j++;
    }
    // prev不存在，i++,暂存prev到prevPendingArray
    if (!isPrevExist) {
      prevPendingArray.push(prev);
      i++;
    }
    // next不存在，j++,暂存next到nextPendingArray
    if (!isNextExist) {
      nextPendingArray.push(next);
      j++;
    }
  }

  if (i < prevChildren.length) {
    prevPendingArray.push(...prevChildren.slice(i));
  }

  if (j < nextChildren.length) {
    nextPendingArray.push(...nextChildren.slice(j));
  }

  // 保存prevPendingArray和nextPendingArray
  if (prevPendingArray.length > 0 || nextPendingArray.length > 0) {
    quene.push({
      prev: prevPendingArray,
      next: nextPendingArray,
    });
  }

  return quene;
};
