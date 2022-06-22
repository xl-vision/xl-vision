import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import React from 'react';
import { isProduction, isServer } from '@xl-vision/utils';
import getContainer, { ContainerReturnType, ContainerType } from '../utils/getContainer';

export type {
  ContainerType as PortalContainerType,
  ContainerReturnType as PortalContainerReturnType,
};

export interface PortalProp {
  children?: React.ReactNode;
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
const Portal: React.FC<PortalProp> = (props) => {
  const { children, container: containerProp } = props;

  if (isServer) {
    return null;
  }

  const container = getContainer(containerProp);

  if (!container) {
    return <>{children}</>;
  }

  return ReactDOM.createPortal(children, container);
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
