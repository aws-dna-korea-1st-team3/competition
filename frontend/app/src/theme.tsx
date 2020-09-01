import { createMuiTheme, ThemeOptions } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#04a6e0',
    },
    secondary: {
      main: '#ec912d',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: "'Spoqa Han Sans', 'Apple SD Gothic Neo', --apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    allVariants: {
      "letterSpacing": -0.2
    }
  }
}

// Create a theme instance.
const theme = createMuiTheme(themeOptions);

export const themeCreator = (prefersDarkMode: boolean) => createMuiTheme({
  ...themeOptions,
  palette: {
    ...themeOptions.palette,
    type: prefersDarkMode ? "dark" : "light",
  }
})

export default theme;
