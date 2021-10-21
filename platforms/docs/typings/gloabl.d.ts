declare module '*.jpg';
declare module '*.md';
declare module '*.css';

interface Window {
  particlesJS: {
    load: (id: string, url: string, cb?: () => void) => void;
  };
  pJSDom: Array<{
    pJS: {
      canvas: { el: HTMLCanvasElement };
      fn: {
        vendors: {
          destroypJS: () => void;
        };
      };
    };
  }>;
}
