import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Login } from "./components/Login";
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo, useState } from 'react';
import Fab from '@mui/material/Fab';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { CopyProvider } from './components/CopyProvider'
import { FileModel } from './models/File';
import { MessageModel } from './models/Message';
import { grey } from '@mui/material/colors';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Direction } from './models/Message';
import { Main } from './components/Main';
import { RoomModel } from './models/Room';

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

const file = new File(["foo"], "foo.json", {
  type: "application/json",
});
const fileContent = new ArrayBuffer(8);

const mockRoom: RoomModel = {
  roomName: 'andres',
  name: 'vkmac',
  devices: [
    {
      peerId: '0',
      name: 'VKMac',
      isOnline: true,
      hasUpdates: true,
      messages: [
        {
          direction: 'sent',
          timestamp: 1750065000000,
          content: {
            type: 'text',
            text: 'Hello'
          }
        },
        {
          direction: 'received',
          timestamp: 1750077540000,
          content: {
            type: 'text',
            text: 'Hi'
          }
        },
        createFileMessage('sent', { state: 'outgoing', file }),
        createFileMessage('received', { state: 'incoming' }),
        createFileMessage('sent', { state: 'sending', content: fileContent, progress: 0.4 }),
        createFileMessage('received', { state: 'receiving', progress: 0.4 }),
        createFileMessage('sent', { state: 'sent' }),
        createFileMessage('received', { state: 'received', content: fileContent }),
        createFileMessage('received', { state: 'rejected' }),
        createFileMessage('received', { state: 'cancelled' }),
        createFileMessage('sent', { state: 'broken' }),
      ],
      sendText(text: string) {
        this.messages.push({
          direction: 'sent',
          timestamp: Date.now(),
          content: {
            type: 'text',
            text,
          }
        });
      },
      sendFile(file: File) {
        this.messages.push({
          direction: 'sent',
          timestamp: Date.now(),
          content: {
            type: 'file',
            file: {
              id: file.name,
              name: file.name,
              mimeType: file.type,
              size: file.size,
              status: { state: 'outgoing', file },
              accept() {},
              reject() {},
              cancel() {}
            }
          }
        })
      },
      removeMessage(message) {
        this.messages = this.messages.filter(item => item !== message);
      }
    },
    {
      peerId: '1',
      name: 'iPhone',
      messages: [],
      sendText() {},
      sendFile() {},
      removeMessage() {},
    },
    {
      peerId: '2',
      name: 'Android',
      messages: [],
      sendText() {},
      sendFile() {},
      removeMessage() {},
    },
  ],
  current: undefined,
}

export function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(old => !old);

  const [room, setRoom] = useState<RoomModel | null>(null);

  const theme = useMemo(() => isDark ? darkTheme : lightTheme, [isDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <CopyProvider>
        {(() => {
          if (room) {
            return (
              <Main room={room} onLogout={() => setRoom(null)} />
            );
          }

          return (
            <>
              <Login onLogin={() => setRoom(mockRoom)} />
              <Fab onClick={() => setRoom(mockRoom)} sx={{ position: 'fixed', right: 20, bottom: 170 }}>
                <ArrowForwardIcon />
              </Fab>
            </>
          );
        })()}
        <Fab onClick={toggleTheme} sx={{ position: 'fixed', right: 20, bottom: 100 }}>
          {isDark ? <DarkModeIcon /> : <LightModeIcon />}
        </Fab>
      </CopyProvider>
    </ThemeProvider>
  );
}

function createFileMessage(direction: Direction, status: FileModel['status']): MessageModel {
  return {
    direction,
    timestamp: 1750111800000 + Math.round(Math.random() * 1000000),
    content: {
      type: 'file',
      file: createFileMock(status),
    }
  };
}

function createFileMock(status: FileModel['status']): FileModel {
  return {
    id: Math.random().toString(),
    name: `${status.state}.json`,
    mimeType: 'application/json',
    size: Math.round(Math.random() * 1000000),
    status,
    accept() {
      alert(`${this.name} accepted`);
    },
    reject() {
      alert(`${this.name} rejected`);
    },
    cancel() {
      alert(`${this.name} cancelled`);
    }
  }
}