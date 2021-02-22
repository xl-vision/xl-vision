import PropTypes from 'prop-types';
import React from 'react';
import CSSTransition, { CSSTransitionClassesObject, CSSTransitionProps } from '../CSSTransition';
import useLayoutEffect from '../hooks/useLayoutEffect';
import { isDevelopment } from '../utils/env';
import { omit } from '../utils/function';
import diff, { DiffData } from './diff';

export interface TransitionGroupClassesObject
  extends Omit<
    CSSTransitionClassesObject,
    'appear' | 'appearActive' | 'appearTo' | 'disappear' | 'disappearActive' | 'disappearTo'
  > {
  move?: string;
}

export type TransitionGroupClasses = string | TransitionGroupClassesObject;

export interface TransitionGroupProps
  extends Omit<
    CSSTransitionProps,
    | 'beforeAppear'
    | 'appear'
    | 'afterAppear'
    | 'appearCancelled'
    | 'beforeDisappear'
    | 'disappear'
    | 'afterDisappear'
    | 'disappearCancelled'
    | 'children'
    | 'transitionOnFirst'
    | 'in'
    | 'classNames'
    | 'mountOnEnter'
    | 'unmountOnLeave'
  > {
  children: Array<CSSTransitionProps['children']>;
  transitionClasses?: TransitionGroupClasses;
}

const TransitionGroup: React.FunctionComponent<TransitionGroupProps> = (props) => {
  const { children, transitionClasses, ..._others } = props;

  // 阻止用户故意传入appear和disappear钩子
  const others = omit(
    _others as CSSTransitionProps,
    'in',
    'beforeAppear',
    'appear',
    'afterAppear',
    'appearCancelled',
    'beforeDisappear',
    'disappear',
    'afterDisappear',
    'disappearCancelled',
  );

  const transitionClassesObj = React.useMemo(() => {
    let obj: CSSTransitionClassesObject & { move?: string } = {};

    if (!transitionClasses) {
      return {};
    }
    // 组件实际上是使用CSSTransition的appear和disappear钩子实现动画，但是向用户隐藏实现细节，
    // 所以这里需要将enter和leave的class设置到appear和disappear上
    if (typeof transitionClasses === 'object') {
      obj = { ...transitionClasses };
      obj.appear = obj.enter;
      obj.appearActive = obj.enterActive;
      obj.appearTo = obj.enterTo;

      obj.disappear = obj.leave;
      obj.disappearActive = obj.leaveActive;
      obj.disappearTo = obj.leaveTo;
    } else {
      obj.appear = obj.enter = `${transitionClasses}-enter`;
      obj.appearTo = obj.enterTo = `${transitionClasses}-enter-to`;
      obj.appearActive = obj.enterActive = `${transitionClasses}-enter-active`;
      obj.disappear = obj.leave = `${transitionClasses}-leave`;
      obj.disappearTo = obj.leaveTo = `${transitionClasses}-leave-to`;
      obj.disappearActive = obj.leaveActive = `${transitionClasses}-leave-active`;
      obj.move = `${transitionClasses}-move`;
    }

    return obj;
  }, [transitionClasses]);

  const prevChildrenRef = React.useRef<Array<React.ReactElement>>();

  const [diffArray, setDiffArray] = React.useState<Array<DiffData>>([]);

  useLayoutEffect(() => {
    const prevChildren = prevChildrenRef.current;
    if (!prevChildren) {
      const array = React.Children.map(children, (it) => ({ prev: [it], next: [it], same: true }));
      setDiffArray(array);
    } else {
      setDiffArray(diff(prevChildren, children));
    }
    prevChildrenRef.current = children;
  }, [children]);

  const nodes: Array<React.ReactElement<CSSTransitionProps>> = [];
  diffArray.forEach((it) => {
    if (it.same) {
      const array = it.next.map((item) => {
        return (
          <CSSTransition
            {...others}
            key={item.key}
            in={true}
            transitionClasses={transitionClassesObj}
            mountOnEnter={true}
            unmountOnLeave={true}
          >
            {item}
          </CSSTransition>
        );
      });
      nodes.push(...array);
    } else {
      const prev = it.prev.map((item) => {
        return (
          <CSSTransition
            {...others}
            key={item.key}
            in={false}
            transitionOnFirst={true}
            mountOnEnter={true}
            unmountOnLeave={true}
            transitionClasses={transitionClassesObj}
          >
            {item}
          </CSSTransition>
        );
      });

      const next = it.next.map((item) => {
        return (
          <CSSTransition
            {...others}
            key={item.key}
            in={true}
            transitionOnFirst={true}
            mountOnEnter={true}
            unmountOnLeave={true}
            transitionClasses={transitionClassesObj}
          >
            {item}
          </CSSTransition>
        );
      });

      nodes.push(...prev, ...next);
    }
  });

  return <>{nodes}</>;
};

if (isDevelopment) {
  TransitionGroup.displayName = 'TransitionGroup';

  TransitionGroup.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired,
    transitionClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  };
}

export default TransitionGroup;
