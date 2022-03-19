export type Cancel = () => void;

const loadedUrlMap = new Map<string, Cancel>();
const loadingUrlMap = new Map<string, Array<(err?: any, cancel?: Cancel) => void>>();

export const loadScript = (url: string, attrs: Record<string, string> = {}) =>
  new Promise<Cancel>((resolve, reject) => {
    const cancel = loadedUrlMap.get(url);
    if (cancel) {
      resolve(cancel);
      return;
    }

    const cbs = loadingUrlMap.get(url);
    if (cbs) {
      const cb = (err?: any, _cancel?: () => void) => {
        if (err) {
          return reject(err);
        }
        resolve(_cancel!);
      };
      cbs.push(cb);
      return;
    }

    const cb = (err?: any) => {
      const tryCancel = () => {
        const _cancel = loadedUrlMap.get(url);
        if (!_cancel) {
          return;
        }
        node.parentElement?.removeChild(node);
        loadedUrlMap.delete(url);
      };

      loadingUrlMap.get(url)?.forEach((it) => it(err, cancel));
      loadingUrlMap.delete(url);
      loadedUrlMap.set(url, tryCancel);

      if (err) {
        return reject(err);
      }
      resolve(tryCancel);
    };

    loadingUrlMap.set(url, []);

    const node = document.createElement('script');

    Object.assign(node, {
      async: true,
      src: url,
      onload: () => cb(),
      onerror: cb,
    });

    Object.keys(attrs).forEach((key) => {
      node.setAttribute(key, attrs[key]);
    });

    document.head.appendChild(node);
  });

export const removeScript = (url: string) => {
  const cancel = loadedUrlMap.get(url);
  if (cancel) {
    loadedUrlMap.delete(url);
    return cancel;
  }
  const cancels = loadingUrlMap.get(url);
  if (cancels) {
    loadingUrlMap.delete(url);
    cancels.forEach((it) => {
      it(new Error('Be cancelled manually'));
    });
  }
};

export const removeAllScript = () => {
  loadedUrlMap.forEach((it) => it());
  loadedUrlMap.clear();

  loadingUrlMap.forEach((arr) =>
    arr.forEach((it) => {
      it(new Error('Be cancelled manually'));
    }),
  );
  loadingUrlMap.clear();
};
