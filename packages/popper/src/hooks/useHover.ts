import { InteractionHook } from '../useInteractions';

const useHover: InteractionHook = ({ reference, popper, update }, disable) => {
  return {
    reference: {},
    popper: {},
  };
};

export default useHover;
