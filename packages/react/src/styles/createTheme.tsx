export type Theme = {
  color: string;
  components?: {
    [key: string]: any;
  };
};

const createTheme = (): Theme => {
  return {
    color: 'red',
  };
};

export default createTheme;
