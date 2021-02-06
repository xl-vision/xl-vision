export type Theme = {
  color: string;
};

const createTheme = (): Theme => {
  return {
    color: 'red',
  };
};

export default createTheme;
