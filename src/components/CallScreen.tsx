import { type JSX, useState, useRef, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  styled
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  FlipCameraIos
} from '@mui/icons-material';

import { CallButton } from './CallButton';

const CONTROLS_HIDE_TIMEOUT = 2000;

const CallContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#1a1a1a',
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 1101,
});

const VideoContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
});

interface ControlsContainerProps {
  shown?: boolean;
}

const ControlsContainer = styled('div')<ControlsContainerProps>(({ shown }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '24px',
  padding: '32px',
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  opacity: shown ? 1 : 0,
  transition: 'opacity 0.5s',
  '&:hover': {
    opacity: 1,
  },
}));

const StyledAvatar = styled(Avatar)({
  width: '160px',
  height: '160px',
  marginBottom: '24px',
  fontSize: '64px',
});

const RemoteVideoElement = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  transform: 'scaleX(-1)', // Зеркальное отображение для более естественного вида
});

const localStreamPositions = [ 'bottom-right', 'top-right', 'top-left', 'bottom-left' ] as const;

type LocalStreamPosition = (typeof localStreamPositions)[number];

interface LocalVideoContainerProps {
  alignment: LocalStreamPosition;
}

const LocalVideoContainer = styled(Box)<LocalVideoContainerProps>(({ alignment }) => {
  const isTop = alignment === 'top-left' || alignment === 'top-right';
  const isLeft = alignment === 'top-left' || alignment === 'bottom-left';

  const verticalStyle = isTop ? { top: '24px' } : { bottom: '24px' };
  const horizontalStyle = isLeft ? { left: '24px' } : { right: '24px' };

  return {
    position: 'absolute',
    ...verticalStyle,
    ...horizontalStyle,
    width: '180px',
    height: '240px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    zIndex: 10,
    backgroundColor: '#000',
  };
});

const LocalVideoElement = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transform: 'scaleX(-1)', // Зеркальное отображение для более естественного вида
});

interface CallScreenProps {
  userName: string;
  userAvatar?: string;
  isVideoCall?: boolean;
  remoteVideoStream?: MediaStream | null;
  localVideoStream?: MediaStream | null;
  onEndCall: () => void;
}

export const CallScreen = ({
  userName,
  userAvatar,
  isVideoCall = false,
  remoteVideoStream: remoteVideoStreamProp = null,
  localVideoStream: localVideoStreamProp = null,
  onEndCall,
}: CallScreenProps): JSX.Element => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [, setFacingMode] = useState<'user' | 'environment'>('user');
  const [showControls, setShowControls] = useState(false);
  const controlsVisibilityStateRef = useRef<{ lastMove: number, timeoutId?: ReturnType<typeof setTimeout> }>({ lastMove: 0 });
  const [localStreamPosition, setLocalStreamPosition] = useState<LocalStreamPosition>('bottom-right');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [remoteVideoStream, setRemoteVideoStream] = useState<MediaStream | null>(remoteVideoStreamProp);
  const [localVideoStream] = useState<MediaStream | null>(localVideoStreamProp);

  // useEffect(() => {
  //   if (localVideoStreamProp) return;

  //   navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(stream => setLocalVideoStream(stream));
  // }, [localVideoStreamProp]);

  useEffect(() => {
    if (remoteVideoStreamProp) return;

    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(stream => setRemoteVideoStream(stream));
  }, [remoteVideoStreamProp]);

  // Подключаем локальный видеопоток к элементу video
  useEffect(() => {
    if (localVideoRef.current && localVideoStream) {
      localVideoRef.current.srcObject = localVideoStream;
    }
  }, [localVideoStream]);

  // Подключаем удаленный видеопоток к элементу video
  useEffect(() => {
    if (remoteVideoRef.current && remoteVideoStream) {
      remoteVideoRef.current.srcObject = remoteVideoStream;
    }
  }, [remoteVideoStream]);

  const handleToggleCamera = () => {
    setIsCameraOn((prev) => {
      const newState = !prev;
      // Управление треками камеры
      if (localVideoStream) {
        localVideoStream.getVideoTracks().forEach((track) => {
          track.enabled = newState;
        });
      }
      return newState;
    });
  };

  const handleToggleMic = () => {
    setIsMicOn((prev) => {
      const newState = !prev;
      // Управление аудио треками
      if (localVideoStream) {
        localVideoStream.getAudioTracks().forEach((track) => {
          track.enabled = newState;
        });
      }
      return newState;
    });
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    // Здесь должна быть логика переключения камеры
  };

  const handleEndCall = () => {
    // Останавливаем все медиа-треки перед завершением
    if (localVideoStream) {
      localVideoStream.getTracks().forEach((track) => track.stop());
    }
    onEndCall();
  };

  return (
    <CallContainer onMouseMove={() => {
      setShowControls(true);

      controlsVisibilityStateRef.current.lastMove = Date.now();

      if (!controlsVisibilityStateRef.current.timeoutId) {
        const check = () => {
          const timeLeft = controlsVisibilityStateRef.current.lastMove + CONTROLS_HIDE_TIMEOUT - Date.now();
          if (timeLeft > 0) {
            controlsVisibilityStateRef.current.timeoutId = setTimeout(check, timeLeft);
            return;
          }

          delete controlsVisibilityStateRef.current.timeoutId;
          setShowControls(false);
        };

        check();
      }
    }}>
      <VideoContainer>
        {isVideoCall && remoteVideoStream ? (
          <RemoteVideoElement 
            ref={remoteVideoRef}
            autoPlay 
            playsInline
          />
        ) : (
          <>
            <StyledAvatar src={userAvatar} alt={userName}>
              {userName.charAt(0).toUpperCase()}
            </StyledAvatar>
            <Typography variant="h4" color="white" fontWeight="500">
              {userName}
            </Typography>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.7)" mt={1}>
              {isVideoCall ? 'Видеозвонок' : 'Голосовой звонок'}
            </Typography>
          </>
        )}
      </VideoContainer>

      {/* Локальное видео в углу экрана */}
      {/* {isCameraOn && localVideoStream && ( */}
        <LocalVideoContainer alignment={localStreamPosition} onClick={() => setLocalStreamPosition(current => {
          // @ts-ignore
          const index = localStreamPositions.indexOf(current);

          if (index === -1) return localStreamPositions[0];

          const next = localStreamPositions[index + 1];

          return next || localStreamPositions[0];
        })}>
          <LocalVideoElement
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
          />
        </LocalVideoContainer>
      {/* )} */}

      <ControlsContainer shown={showControls}>
        <CallButton
          label="flip"
          onClick={handleSwitchCamera}
          aria-label="Flip camera"
          disabled={!isVideoCall}
        >
          <FlipCameraIos />
        </CallButton>

        <CallButton
          label="video"
          onClick={handleToggleCamera}
          variant={isCameraOn ? 'active' : 'default'}
          aria-label={isCameraOn ? 'Disable video' : 'Enable video'}
          disabled={!isVideoCall}
        >
          {isCameraOn ? <Videocam /> : <VideocamOff />}
        </CallButton>

        <CallButton
          label="mute"
          onClick={handleToggleMic}
          variant={isMicOn ? 'active' : 'default'}
          aria-label={isMicOn ? 'Disable audio' : 'Enable audio'}
        >
          {isMicOn ? <Mic /> : <MicOff />}
        </CallButton>

        <CallButton
          label="end"
          onClick={handleEndCall}
          variant="error"
          aria-label="End call"
        >
          <CallEnd />
        </CallButton>
      </ControlsContainer>
    </CallContainer>
  );
};
