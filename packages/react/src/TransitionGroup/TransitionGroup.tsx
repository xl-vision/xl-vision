import PropTypes from 'prop-types';
import React from 'react';
import { isProduction, warning } from '@xl-vision/utils';
import {
  CssTransitionClassNameRecord,
  TransitionEndHook,
  useIsomorphicLayoutEffect,
} from '@xl-vision/hooks';
import CssTransition, { CssTransitionProps } from '../CssTransition';
import { omit } from '../utils/function';
import diff, { DiffData } from './diff';

export interface TransitionGroupClassNameRecord
  extends Omit<
    CssTransitionClassNameRecord,
    'appearFrom' | 'appearActive' | 'appearTo' | 'disappearFrom' | 'disappearActive' | 'disappearTo'
  > {
  move?: string;
}

export type TransitionGroupClassName = string | TransitionGroupClassNameRecord;

export interface TransitionGroupProps
  extends Omit<
    CssTransitionProps,
    | 'children'
    | 'transitionOnFirst'
    | 'in'
    | 'transitionClassName'
    | 'mountOnEnter'
    | 'unmountOnLeave'
  > {
  children: Array<React.ReactElement>;
  transitionClassName?: TransitionGroupClassName;
}

const TransitionGroup: React.FunctionComponent<TransitionGroupProps> = (props) => {
  const { children, transitionClassName: transitionClasses, onExited, ..._others } = props;

  // 阻止用户故意传入appear和disappear钩子
  const others = omit(_others as CssTransitionProps, 'in');

  const transitionClassesRecord = React.useMemo(() => {
    let obj: CssTransitionClassNameRecord = {};

    if (!transitionClasses) {
      return {};
    }
    // 组件实际上是使用CssTransition的appear和disappear钩子实现动画，但是向用户隐藏实现细节，
    // 所以这里需要将enter和leave的class设置到appear和disappear上
    if (typeof transitionClasses === 'object') {
      obj = { ...transitionClasses };
      obj.appearFrom = obj.enterFrom;
      obj.appearActive = obj.enterActive;
      obj.appearTo = obj.enterTo;

      obj.disappearFrom = obj.exitFrom;
      obj.disappearActive = obj.exitActive;
      obj.disappearTo = obj.exitTo;
    } else {
      obj.appearFrom = obj.enterFrom = `${transitionClasses}-enter-from`;
      obj.appearTo = obj.enterTo = `${transitionClasses}-enter-to`;
      obj.appearActive = obj.enterActive = `${transitionClasses}-enter-active`;
      obj.disappearFrom = obj.exitFrom = `${transitionClasses}-exit-from`;
      obj.disappearTo = obj.exitTo = `${transitionClasses}-exit-to`;
      obj.disappearActive = obj.exitActive = `${transitionClasses}-exit-active`;
    }

    return obj;
  }, [transitionClasses]);

  const prevChildrenRef = React.useRef<Array<React.ReactElement>>();

  const [diffArray, setDiffArray] = React.useState<Array<DiffData>>([]);

  const handleExited = React.useCallback(
    (key: React.Key | null) => {
      warning(!key, `<TransitioGroup> must has a key`);
      const hook: TransitionEndHook = (e, transitionOnFirst) => {
        onExited?.(e, transitionOnFirst);
        prevChildrenRef.current = prevChildrenRef.current?.filter((it) => it.key !== key);
      };

      return hook;
    },
    [onExited],
  );

  useIsomorphicLayoutEffect(() => {
    const prevChildren = prevChildrenRef.current;
    const array = prevChildren
      ? diff(prevChildren, children)
      : React.Children.map<DiffData, React.ReactElement>(children, (it) => ({
          prev: [it],
          next: [it],
          same: true,
        }));

    setDiffArray(array);

    const nodes: Array<React.ReactElement> = [];
    array.forEach((it) => {
      if (it.same) {
        nodes.push(...it.next);
      } else {
        nodes.push(...it.prev, ...it.next);
      }
    });

    prevChildrenRef.current = nodes;
  }, [children]);

  const nodes: Array<React.ReactElement<CssTransitionProps>> = [];
  diffArray.forEach((it) => {
    if (it.same) {
      const array = it.next.map((item) => {
        return (
          <CssTransition
            {...others}
            key={item.key}
            in={true}
            transitionClassName={transitionClassesRecord}
            mountOnEnter={true}
            unmountOnExit={true}
          >
            {item}
          </CssTransition>
        );
      });
      nodes.push(...array);
    } else {
      const prev = it.prev.map((item) => {
        return (
          <CssTransition
            {...others}
            key={item.key}
            in={false}
            transitionOnFirst={true}
            mountOnEnter={true}
            unmountOnExit={true}
            transitionClassName={transitionClassesRecord}
            onExited={handleExited(item.key)}
          >
            {item}
          </CssTransition>
        );
      });

      const next = it.next.map((item) => {
        return (
          <CssTransition
            {...others}
            key={item.key}
            in={true}
            transitionOnFirst={true}
            mountOnEnter={true}
            unmountOnExit={true}
            transitionClassName={transitionClassesRecord}
          >
            {item}
          </CssTransition>
        );
      });

      nodes.push(...prev, ...next);
    }
  });

  return <>{nodes}</>;
};

if (!isProduction) {
  TransitionGroup.displayName = 'TransitionGroup';

  TransitionGroup.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired,
    transitionClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onExited: PropTypes.func,
  };
}

export default TransitionGroup;
