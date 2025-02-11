import {
  CssTransitionClassNameRecord,
  TransitionEndHook,
  useConstantFn,
  useIsomorphicLayoutEffect,
} from '@xl-vision/hooks';
import { isObject, isProduction, warning } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactElement, FC, useMemo, useState, useCallback, Key, cloneElement } from 'react';
import diff from './diff';
import Transition, { TransitionProps } from '../Transition';

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
    TransitionProps,
    | 'children'
    | 'transitionOnFirst'
    | 'in'
    | 'transitionClassName'
    | 'mountOnEnter'
    | 'unmountOnExit'
  > {
  children: Array<ReactElement>;
  transitionClassName?: TransitionGroupClassName;
}

const TransitionGroup: FC<TransitionGroupProps> = (props) => {
  const { children, transitionClassName: transitionClasses, onExited, ...others } = props;

  const transitionClassesRecord = useMemo(() => {
    let obj: CssTransitionClassNameRecord = {};

    if (!transitionClasses) {
      return {};
    }
    // 组件实际上是使用CssTransition的appear和disappear钩子实现动画，但是向用户隐藏实现细节，
    // 所以这里需要将enter和exit的class设置到appear和disappear上
    if (isObject(transitionClasses)) {
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

  const [nodes, setNodes] = useState<Array<ReactElement>>();

  const handleExited = useCallback(
    (key: Key | null) => {
      warning(!key, `<TransitioGroup> must has a key`);
      const hook: TransitionEndHook = (e, transitionOnFirst) => {
        onExited?.(e, transitionOnFirst);
        setNodes((prev) =>
          prev?.filter((it) => {
            return it.key !== key;
          }),
        );
      };

      return hook;
    },
    [onExited],
  );

  const handleChildrenChange = useConstantFn((value: Array<ReactElement>) => {
    const nextChildren = value.map((it) => {
      return (
        <Transition
          {...others}
          in={true}
          key={it.key}
          mountOnEnter={true}
          transitionClassName={transitionClassesRecord}
          unmountOnExit={true}
          onExited={handleExited(it.key)}
          // transitionOnFirst={true}
        >
          {it}
        </Transition>
      );
    });

    const array = nodes
      ? diff(nodes, nextChildren)
      : nextChildren.map((it) => {
          return {
            prev: [it],
            next: [it],
            same: true,
          };
        });

    const nextNodes: Array<ReactElement> = [];
    array.forEach((it) => {
      if (it.same) {
        nextNodes.push(...it.next);
      } else {
        const prev = it.prev.map((item) => {
          return cloneElement(item as ReactElement<{ in?: boolean }>, {
            in: false,
          });
        });
        const next = it.next.map((item) => {
          return cloneElement(item as ReactElement<{ in?: boolean; transitionOnFirst?: boolean }>, {
            in: true,
            transitionOnFirst: true,
          });
        });
        nextNodes.push(...prev, ...next);
      }
    });

    setNodes(nextNodes);
  });

  useIsomorphicLayoutEffect(() => {
    handleChildrenChange(children);
  }, [children, handleChildrenChange]);

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
