import { isProduction, isServer } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { ReactNode, FC } from 'react';
import { createPortal } from 'react-dom';
import getContainer, { ContainerType } from '../utils/getContainer';

export {
  type ContainerReturnType as PortalContainerReturnType,
  type ContainerType as PortalContainerType,
} from '../utils/getContainer';

export interface PortalProp {
  children?: ReactNode;
  container?: ContainerType;
}

/**
 * 支持服务端渲染
 * getContainer支持传递父元素，字符串或者undefined,也可以通过函数返回
 * 如果传递字符串，则根据字符串进行查询节点
 * 如果是undefined，则直接挂载在当前位置
 * @param props
 * @constructor
 */
const Portal: FC<PortalProp> = (props) => {
  const { children, container: containerProp } = props;

  if (!isServer) {
    const container = getContainer(containerProp);
    if (container) {
      return createPortal(children, container);
    }
  }

  return <>{children}</>;
};

if (!isProduction) {
  Portal.displayName = 'Portal';

  Portal.propTypes = {
    children: PropTypes.element.isRequired,
    container: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
  };
}

export default Portal;
