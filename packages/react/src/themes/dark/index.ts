import { ThemeInput } from '../../ThemeProvider';
import { blue, red, neutral, green, amber } from '../palettes';
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
    primary: blue,
    error: red,
    warning: amber,
    info: neutral,
    success: green,
  },
  dark: true,
});

const theme: ThemeInput = {
  colors,
};

export default theme;
