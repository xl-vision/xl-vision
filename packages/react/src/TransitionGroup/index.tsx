import React from 'react';
import CSSTransition, { CSSTransitionClassesObject, CSSTransitionProps } from '../CSSTransition';
import useLayoutEffect from '../hooks/useLayoutEffect';
import { omit } from '../utils/function';

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

  const childrenTransition = React.useMemo(() => {
    return children.map((it) => {
      return <CSSTransition key={it.key}>{it}</CSSTransition>;
    });
  }, [children]);

  useLayoutEffect(() => {
    prevChildrenRef.current = childrenTransition;
  }, [childrenTransition]);

  if (!prevChildrenRef.current) {
    return childrenTransition;
  }
};

export default TransitionGroup;
