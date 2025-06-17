import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Peers } from "./components/Peers";
import { DeviceModel } from "./models/Device";
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo, useState } from 'react';
import { grey } from '@mui/material/colors';

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

const devices: DeviceModel[] = [
  {
    peerId: '0',
    name: 'VKMac',
    isOnline: true,
    hasUpdates: true
  },
  {
    peerId: '1',
    name: 'iPhone',
  },
  {
    peerId: '2',
    name: 'Android',
  },
]

export function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(old => !old);

  const theme = useMemo(() => isDark ? darkTheme : lightTheme, [isDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Peers
        name="MyName"
        devices={devices}
        onMenuClick={() => {}}
        onRenameClick={() => {}}
        onSelect={() => {}}
      />
    </ThemeProvider>
  );
}
