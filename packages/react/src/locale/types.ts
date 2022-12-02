export type Locale = {
  Popconfirm: {
    confirmText: string;
    cancelText: string;
  };
  Dialog: {
    confirmText: string;
    cancelText: string;
    methods: {
      successText: string;
      infoText: string;
      errorText: string;
      warningText: string;
      confirm: {
        confirmText: string;
        cancelText: string;
      };
    };
  };
};
export type Locales = {
  [lang: string]: Locale;
};
