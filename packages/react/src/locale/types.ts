export type Locale = {
  Popconfirm: {
    confirmText: string;
    cancelText: string;
  };
  Dialog: {
    confirmText: string;
    cancelText: string;
  };
};
export type Locales = {
  [lang: string]: Locale;
};
