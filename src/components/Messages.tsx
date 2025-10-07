import { type ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack, { StackProps } from '@mui/material/Stack';
import { DeviceModel } from '../models/Device';
import InputAdornment from '@mui/material/InputAdornment';
import { AvatarWithName } from './AvatarWithName';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { Message } from './Message/Message';
import { ChatToolbar } from './ChatToolbar';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
// import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
// import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
// import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
// import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
// import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';
// import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';

const Column = (props: Omit<StackProps, 'direction'>) => <Stack {...props} direction="column" />;

const Container = styled(Column)(() => ({
  height: '100dvh',
  minHeight: '100%',
  maxHeight: '100%',
  justifyContent: 'stretch',
  alignItems: 'center',

  position: 'relative',
}));

const SizeContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 600
  },
}));

const MessagesContainer = styled(Column)(() => ({
  width: '100%',
  alignItems: 'center',
  overflowY: 'auto',
  flexGrow: 1,
}));

const MessagesContainerInner = styled(SizeContainer)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'end',
  gap: theme.spacing(1)
}))

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export interface MessagesProps {
  device: DeviceModel;
  onBack: VoidFunction;
}

export const Messages = observer(function Messages({ device, onBack }: MessagesProps) {
  const [enabled, setIsEnabled] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToLastMessage = () => {
    if (!messagesContainerRef.current?.children?.length) return;

    messagesContainerRef.current.children[
      messagesContainerRef.current.children.length - 1
    ].scrollIntoView(false);
  };

  useEffect(scrollToLastMessage, [device.messages.length]);

  const sendMessage = () => {
    if (!inputRef.current) return;

    device.sendText(inputRef.current.value);

    inputRef.current.value = '';
  };

  const checkEnabled: ChangeEventHandler<HTMLInputElement> = (event) => setIsEnabled(
    Boolean(event.target.value.trim().length)
  );

  return (
    <Container>
      <AppBar position="static">
        <ChatToolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="Menu"
            onClick={onBack}
          >
            <ArrowBackOutlinedIcon />
          </IconButton>
          <AvatarWithName name={device.name} isOnline={device.isOnline} />
          <Column sx={{ ml: 2 }}>
            <Typography variant="body1" component="h1" sx={{ flexGrow: 1 }}>
              {device.name}
            </Typography>
          </Column>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="Video call"
            onClick={() => {/*device.stream()*/}}
          >
            <VideocamOutlinedIcon />
          </IconButton>
        </ChatToolbar>
      </AppBar>
      <MessagesContainer>
        <MessagesContainerInner ref={messagesContainerRef}>
          {device.messages.map((message, index) => (
            <Message
              key={index}
              message={message}
              onDelete={() => device.removeMessage(message)}
            />
          ))}
        </MessagesContainerInner>
      </MessagesContainer>
      <SizeContainer>
        <OutlinedInput
          inputRef={inputRef}
          placeholder="Message"
          autoFocus
          multiline
          maxRows={15}
          fullWidth
          size="small"
          disabled={!device.isOnline}
          startAdornment={
            <>
              <InputAdornment position="start">
                <IconButton component="label" disabled={!device.isOnline}>
                  <AttachFileIcon />
                  <VisuallyHiddenInput
                    type="file"
                    value={[]}
                    onChange={(event) => {
                      if (!event.target.files) return;

                      for(const file of event.target.files) {
                        device.sendFile(file);
                      }
                    }}
                    multiple
                  />
                </IconButton>
              </InputAdornment>
            </>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton disabled={!enabled || !device.isOnline} onClick={sendMessage}><SendIcon /></IconButton>
            </InputAdornment>
          }
          onChange={checkEnabled}
          onKeyDown={event => {
            if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
              event.preventDefault();

              sendMessage();
            }
          }}
        />
      </SizeContainer>
    </Container>
  );
});
