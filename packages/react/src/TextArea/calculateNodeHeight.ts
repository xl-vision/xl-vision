// Thanks to https://github.com/react-component/textarea/blob/master/src/calculateNodeHeight.tsx

import React from 'react';

const HIDDEN_TEXTAREA_STYLE = `
  min-height:0 !important;
  max-height:none !important;
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`;

const SIZING_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'font-variant',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing',
  'word-break',
];

let hiddenTextarea: HTMLTextAreaElement;

export default (
  node: HTMLTextAreaElement,
  minRows: number | null = null,
  maxRows: number | null = null,
): React.CSSProperties => {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    hiddenTextarea.setAttribute('tab-index', '-1');
    hiddenTextarea.setAttribute('aria-hidden', 'true');
    document.body.appendChild(hiddenTextarea);
  }

  // https://github.com/ant-design/ant-design/issues/6577
  const wrap = node.getAttribute('wrap');
  if (wrap) {
    hiddenTextarea.setAttribute('wrap', wrap);
  } else {
    hiddenTextarea.removeAttribute('wrap');
  }

  const { paddingSize, borderSize, boxSizing, sizingStyle } = calculateNodeStyling(node);

  hiddenTextarea.setAttribute('style', `${sizingStyle};${HIDDEN_TEXTAREA_STYLE}`);
  hiddenTextarea.value = node.value || node.placeholder || '';

  let minHeight = Number.MIN_SAFE_INTEGER;
  let maxHeight = Number.MAX_SAFE_INTEGER;
  let height = hiddenTextarea.scrollHeight;
  let overflowY: React.CSSProperties['overflowY'];

  if (boxSizing === 'border-box') {
    // border-box: add border, since height = content + padding + border
    height += borderSize;
  } else if (boxSizing === 'content-box') {
    // remove padding, since height = content
    height -= paddingSize;
  }

  if (minRows !== null || maxRows !== null) {
    // measure height of a textarea with a single row
    hiddenTextarea.value = ' ';
    const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
    if (minRows !== null) {
      minHeight = singleRowHeight * minRows;
      if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize;
      }
      height = Math.max(minHeight, height);
    }
    if (maxRows !== null) {
      maxHeight = singleRowHeight * maxRows;
      if (boxSizing === 'border-box') {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      overflowY = height > maxHeight ? undefined : 'hidden';
      height = Math.min(maxHeight, height);
    }
  }
  return { height, minHeight, maxHeight, overflowY };
};

function calculateNodeStyling(node: HTMLElement) {
  const style = window.getComputedStyle(node);

  const boxSizing =
    style.getPropertyValue('box-sizing') ||
    style.getPropertyValue('-moz-box-sizing') ||
    style.getPropertyValue('-webkit-box-sizing');

  const paddingSize =
    parseFloat(style.getPropertyValue('padding-bottom')) +
    parseFloat(style.getPropertyValue('padding-top'));

  const borderSize =
    parseFloat(style.getPropertyValue('border-bottom-width')) +
    parseFloat(style.getPropertyValue('border-top-width'));

  const sizingStyle = SIZING_STYLE.map((name) => `${name}:${style.getPropertyValue(name)}`).join(
    ';',
  );

  const nodeInfo = {
    sizingStyle,
    paddingSize,
    borderSize,
    boxSizing,
  };

  return nodeInfo;
}
