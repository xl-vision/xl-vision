import { PortalContainerType } from '../Portal';

export type MessageConfig = {
  top: number;
  duration: number;
  maxCount: number;
  container: PortalContainerType<HTMLElement>;
};

const messageConfig: MessageConfig = {
  top: 8,
  duration: 3000,
  maxCount: 0,
  container: () => document.body,
};

export default messageConfig;

export const setConfig = (config: Partial<MessageConfig>) => {
  Object.keys(config).forEach((key) => {
    const k = key as keyof MessageConfig;
    const v = config[k];

    if (v) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      messageConfig[k] = v as any;
    }
  });
};
