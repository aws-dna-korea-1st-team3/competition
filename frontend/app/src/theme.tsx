import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: "'Spoqa Han Sans', 'Apple SD Gothic Neo', --apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    allVariants: {
      "letterSpacing": -0.2
    }
  }
});

export default theme;
