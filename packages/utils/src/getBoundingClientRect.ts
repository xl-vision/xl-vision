const getBoundingClientRect = (element: Element) => {
  const rect = element.getBoundingClientRect();

  // x y兼容性不佳
  const { width, height, left: x, top: y } = rect;

  return {
    x,
    y,
    left: x,
    top: y,
    width,
    height,
    right: x + width,
    bottom: y + height,
  };
};
export default getBoundingClientRect;
