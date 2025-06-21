import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CopyProvider } from './components/CopyProvider'
import { grey } from '@mui/material/colors';
import { ContainerProvider, useModel } from './components/ContainerProvider';
import { AppModel } from './models/App';
import { Login } from './components/Login';
import { Main } from './components/Main';
import { PWABackgroundColor } from './components/PWABackgroundColor';

const lightTheme = createTheme({
  palette: {
    primary: {
      main: grey[900],
      contrastText: grey[50],
    },
    success: {
      main: '#528f3c',
      contrastText: grey[50],
    },
    background: {
      default: grey[50],
    },
  },
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: grey[300],
    },
  },
});

export const App = observer(function App() {
  const app = useModel(AppModel);

  const isDark = app.isDarkTheme;
  const theme = useMemo(() => isDark ? darkTheme : lightTheme, [isDark]);

  return (
    <PWABackgroundColor color={theme.palette.background.default}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CopyProvider>
          {app.credentials ? (
            <ContainerProvider credentials={app.credentials}>
              <Main onLogout={() => app.logout()} />
            </ContainerProvider>
          ) : (
            <Login onLogin={(credentials) => app.login(credentials)} />
          )}
        </CopyProvider>
      </ThemeProvider>
    </PWABackgroundColor>
  );
});
