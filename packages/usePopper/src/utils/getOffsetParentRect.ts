import {
  getDocumentElement,
  isElement,
  isFirefox,
  isHTMLElement,
  getComputedStyle,
} from '@xl-vision/utils';
import getNodeName from './getNodeName';
import getParentNode from './getParentNode';

export type OffsetParentRect = { parent: Element; left: number; top: number };

/**
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetParent
 * @param element
 * @returns
 */
const getOffsetParentRect = (element: Element): OffsetParentRect => {
  if (isHTMLElement(element)) {
    let { offsetParent } = element;

    // parent为table时，即使为static，也会返回table，这里处理一下
    while (
      offsetParent &&
      isTableElement(offsetParent) &&
      getComputedStyle(offsetParent).position === 'static'
    ) {
      offsetParent = offsetParent.offsetParent;
    }

    // 屏蔽浏览器在返回body还是html之间的差异，统一返回html
    if (
      !offsetParent ||
      (getNodeName(offsetParent) === 'body' && !isContainingBlock(element, offsetParent))
    ) {
      offsetParent = getDocumentElement(element);
    }

    return {
      parent: offsetParent,
      left: offsetParent.clientLeft,
      top: offsetParent.clientTop,
    };
  }

  // node不是HTMLElement, 则寻找parent
  const parentNode = getParentNode(element);

  if (parentNode && isElement(parentNode)) {
    return getContainingBlockRect(element);
  }

  const parentEl = getDocumentElement(element);
  return {
    parent: parentEl,
    left: parentEl.clientLeft,
    top: parentEl.clientTop,
  };
};

export default getOffsetParentRect;

const isTableElement = (node: Node): node is HTMLElement => {
  return ['table', 'td', 'th'].includes(getNodeName(node));
};

// https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block
const isContainingBlock = (element: Element, parent: Element): boolean => {
  const elementCss = getComputedStyle(element);
  const parentCss = getComputedStyle(parent);

  // 不存在此情况
  // if (
  //   oneOf(['static', 'relative', 'sticky'], elementCss.position) &&
  //   /block|flex|table|grid/.test(parentCss.display)
  // ) {
  //   return ContainingBlockType.CONTENT_BLOCK;
  // }

  if (elementCss.position === 'absolute' && parentCss.position !== 'static') {
    return true;
  }

  if (['absolute', 'fixed'].includes(elementCss.position)) {
    const firefox = isFirefox();
    return (
      parentCss.transform !== 'none' ||
      parentCss.perspective !== 'none' ||
      parentCss.contain === 'paint' ||
      ['transform', 'perspective'].includes(parentCss.willChange) ||
      (firefox && parentCss.willChange === 'filter') ||
      (firefox && (parentCss.filter ? parentCss.filter !== 'none' : false))
    );
  }

  return false;
};

const getContainingBlockRect = (element: Element): OffsetParentRect => {
  let { parentNode } = element;
  while (parentNode && isElement(parentNode)) {
    if (isContainingBlock(element, parentNode)) {
      return {
        parent: parentNode,
        left: parentNode.clientLeft,
        top: parentNode.clientTop,
      };
    }

    parentNode = parentNode.parentNode;
  }

  const parentEl = getDocumentElement(element);
  return {
    parent: parentEl,
    left: parentEl.clientLeft,
    top: parentEl.clientTop,
  };
};
