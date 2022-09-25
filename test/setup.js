if (typeof window !== 'undefined') {
  window.resizeTo = (width, height) => {
    window.innerWidth = width || window.innerWidth;
    window.innerHeight = height || window.innerHeight;
    window.dispatchEvent(new Event('resize'));
  };
  if (!window.matchMedia) {
    Object.defineProperty(global.window, 'matchMedia', {
      value: jest.fn((query) => ({
        matches: query.includes('max-width'),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });
  }
}

window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.requestAnimationFrame = window.requestAnimationFrame;
window.cancelAnimationFrame = (cb) => clearTimeout(cb);
global.cancelAnimationFrame = window.cancelAnimationFrame;
