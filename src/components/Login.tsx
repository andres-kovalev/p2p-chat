import { FormEvent, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Credentials } from '../types';
import { hashString } from '../utils/hash';

const Container = styled(Stack)(({ theme }) => ({
  height: '100dvh',
  minHeight: '100%',
  maxHeight: '100%',
  padding: 0,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  }
}));

const FormCard = styled(Card)(({ theme }) => ({
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

export interface LoginProps {
  onLogin: (credentials: Credentials) => void;
  onScanClick?: VoidFunction;
}

export function Login({ onLogin, onScanClick }: LoginProps) {
  const [enabled, setEnabled] = useState(false);

  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const deviceNameRef = useRef<HTMLInputElement>(null);

  const checkEnabled = () => {
    setEnabled(Boolean(
      loginRef.current?.value &&
        passwordRef.current?.value &&
        deviceNameRef.current?.value
    ));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!enabled) return;

    onLogin({
      login: loginRef.current!.value,
      hash: await hashString(passwordRef.current!.value),
      deviceName: deviceNameRef.current!.value,
    });
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Container direction="column" justifyContent="space-between">
        <FormCard variant="outlined">
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
                  required
                  fullWidth
                  variant="outlined"
                  inputRef={deviceNameRef}
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
              {onScanClick && (
                <>
                  <Divider>or</Divider>
                  <Button
                    fullWidth
                    variant="text"
                    onClick={onScanClick}
                    startIcon={<QrCodeScannerIcon />}
                    size="large"
                    >
                    Scan QR code1
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </FormCard>
      </Container>
    </>
  );
}
