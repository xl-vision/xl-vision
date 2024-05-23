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
    primary: '#1d4ed8',
    error: '#be123c',
    warning: '#ea580c',
    info: '#57534e',
    success: '#15803d',
  },
  dark: true,
});

const theme: ThemeInput = {
  colors,
};

export default theme;
