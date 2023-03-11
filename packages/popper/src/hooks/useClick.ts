import { useEvent } from '@xl-vision/hooks';
import { useEffect, useRef } from 'react';
import { InteractionHook } from '../useInteraction';

export type ClickOptions = {
  disablePopperClick?: boolean;
};

const useClick: InteractionHook<ClickOptions> = (
  { setOpen },
  { skip, disablePopperClick } = {},
) => {
  const isPopperClick = useRef(false);

  const handleClick = useEvent(() => {
    setOpen(true);
    isPopperClick.current = true;
  });

  const handlePopperClick = useEvent(() => {
    if (!disablePopperClick) {
      isPopperClick.current = true;
    }
  });

  useEffect(() => {
    if (skip) {
      return;
    }

    const fn = () => {
      // 由于捕获阶段的事件要先于冒泡阶段，这个事件会先执行
      // 但是点击reference或popper时不应该关闭，所以这里setTimeout滞后进行判断
      setTimeout(() => {
        if (isPopperClick.current) {
          isPopperClick.current = false;
          return;
        }
        setOpen(false);
      });
    };

    // 监听捕获阶段，防止有些元素阻止冒泡
    window.addEventListener('click', fn, true);

    return () => {
      window.removeEventListener('click', fn);
    };
  }, [skip, setOpen]);

  if (skip) {
    return {};
  }

  return {
    reference: {
      onClick: handleClick,
    },
    popper: {
      onClick: handlePopperClick,
    },
  };
};

export default useClick;
