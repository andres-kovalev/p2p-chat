import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Credentials } from '../types';
import { hashString } from '../utils/hash';

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: 0,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const SignInFormCard = styled(Card)(({ theme }) => ({
  alignSelf: 'center',
  margin: 'auto',
  padding: theme.spacing(4),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
    maxWidth: 450,
  },
  [theme.breakpoints.down('sm')]: {
    border: 'none',
    borderRadius: 0
  }
}));

interface LoginProps {
  onLogin: (credentials: Credentials) => void;
}

export default function SignIn({ onLogin }: LoginProps) {
  const [enabled, setEnabled] = useState(false);

  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const deviceIdRef = useRef<HTMLInputElement>(null);

  const checkEnabled = () => {
    setEnabled(Boolean(
      loginRef.current?.value &&
        passwordRef.current?.value &&
        deviceIdRef.current?.value
    ));
  };

  const handleSubmit = async () => {
    if (!enabled) return;

    onLogin({
      login: loginRef.current!.value,
      hash: await hashString(passwordRef.current!.value),
      deviceId: deviceIdRef.current!.value,
    });
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <SignInFormCard variant="outlined">
          <CardContent>
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', mb: 2 }}
            >
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              <FormControl>
                <TextField
                  name="login"
                  placeholder="Login"
                  autoComplete="login"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  inputRef={loginRef}
                  onChange={checkEnabled}
                />
              </FormControl>
              <FormControl>
                <TextField
                  name="password"
                  placeholder="••••••"
                  type="password"
                  autoComplete="current-password"
                  required
                  fullWidth
                  variant="outlined"
                  inputRef={passwordRef}
                  onChange={checkEnabled}
                />
              </FormControl>
              <FormControl>
                <TextField
                  name="name"
                  placeholder="My device"
                  autoComplete="name"
                  required
                  fullWidth
                  variant="outlined"
                  inputRef={deviceIdRef}
                  onChange={checkEnabled}
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disableElevation
                disabled={!enabled}
              >
                Join
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => alert('Sign in with Google')}
                startIcon={<QrCodeScannerIcon />}
              >
                Scan QR code1
              </Button>
            </Box>
          </CardContent>
        </SignInFormCard>
      </SignInContainer>
    </>
  );
}