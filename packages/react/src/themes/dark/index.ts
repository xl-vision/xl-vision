import { ThemeInput } from '../../ThemeProvider';
import { createColors } from '../shared/colors';

const colors = createColors({
  contrastThreshold: 3,
  text: '#fff',
  inverseText: '#000',
  background: '#141414',
  opacity: {
    disabled: 0.3,
    ripple: 0.3,
  },
  themes: {
    primary: '#1976d2',
    error: '#d32f2f',
    warning: '#ed6c02',
    info: '#66768d',
    success: '#2e7d32',
  },
  dark: true,
});

const theme: ThemeInput = {
  colors,
};

export default theme;
