import { oneOf } from './array';
import { isFirefox } from './device';
import getDocumentElement from './getDocumentElement';
import { isHTMLElement, isShadowRoot } from './is';

/**
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetParent
 * @param element
 * @returns
 */
const getOffsetParent = (node: Node): Element => {
  if (isHTMLElement(node)) {
    let { offsetParent } = node;

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
      (getNodeName(offsetParent) === 'body' &&
        getComputedStyle(offsetParent as HTMLElement).position === 'static' &&
        !isContainingBlock(offsetParent as HTMLElement))
    ) {
      return getDocumentElement(node);
    }
    return offsetParent;
  }

  // node不是HTMLElement, 则寻找parent
  const parentNode = getParentNode(node);

  if (!parentNode) {
    return getDocumentElement(node);
  }

  if (isHTMLElement(parentNode) && isContainingBlock(parentNode)) {
    return parentNode;
  }

  return getOffsetParent(parentNode);
};

export default getOffsetParent;

const isTableElement = (node: Node): node is HTMLElement => {
  return oneOf(['table', 'td', 'th'], getNodeName(node));
};

const getNodeName = (element: Node) => (element.nodeName || '').toLowerCase();

const isContainingBlock = (element: Element): boolean => {
  // TODO: Try and use feature detection here instead
  const firefox = isFirefox();
  const css = getComputedStyle(element);

  // This is non-exhaustive but covers the most common CSS properties that
  // create a containing block.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return (
    css.transform !== 'none' ||
    css.perspective !== 'none' ||
    css.contain === 'paint' ||
    ['transform', 'perspective'].includes(css.willChange) ||
    (firefox && css.willChange === 'filter') ||
    (firefox && (css.filter ? css.filter !== 'none' : false))
  );
};

const getParentNode = (node: Node): Node => {
  if (getNodeName(node) === 'html') {
    return node;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (node.assignedSlot as Node) ||
    node.parentNode ||
    (isShadowRoot(node) && node.host) ||
    getDocumentElement(node)
  );
};
