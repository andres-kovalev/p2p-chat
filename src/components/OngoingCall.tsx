import { type JSX, useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import FlipCameraIcon from '@mui/icons-material/FlipCameraIos';
import CloseIcon from '@mui/icons-material/Close';
import { CallContainer } from './CallContainer';
import { CallButton } from './CallButton';
import { CallAvatar } from './CallAvatar';
import { CallActionsContainer } from './CallActionsContainer';

const CONTROLS_HIDE_TIMEOUT = 2000;

const VideoContainer = styled(Stack)({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  maxHeight: '100%'
});

interface ControlsContainerProps {
  shown?: boolean;
}

const ControlsContainer = styled(CallActionsContainer)<ControlsContainerProps>(({ shown }) => ({
  alignItems: 'center',
  opacity: shown ? 1 : 0,
  transition: 'opacity 0.5s',
  '&:hover': {
    opacity: 1,
  },
}));

const Stream = styled('video')({
  width: '100%',
  height: '100%',
  transform: 'scaleX(-1)', // Зеркальное отображение для более естественного вида
});

const RemoteStream = styled(Stream)({
  objectFit: 'contain',
});

const localStreamPositions = [ 'bottom-right', 'top-right', 'top-left', 'bottom-left' ] as const;

type LocalStreamPosition = (typeof localStreamPositions)[number];

interface LocalVideoContainerProps {
  alignment: LocalStreamPosition;
  aspectRatio: number;
}

const SIZE_LIMIT = 240;
const DEFAULT_ASPECT_RATIO = 4 / 3;

const LocalStreamContainer = styled(Box)<LocalVideoContainerProps>(({ alignment, aspectRatio }) => {
  const isPortrait = aspectRatio <= 1;
  const isTop = alignment === 'top-left' || alignment === 'top-right';
  const isLeft = alignment === 'top-left' || alignment === 'bottom-left';

  const verticalStyle = isTop ? { top: '24px' } : { top: 'calc(100vh - var(--height) - var(--margin) - var(--actions-panel-height))' };
  const horizontalStyle = isLeft ? { left: '24px' } : { left: 'calc(100vw - var(--width) - var(--margin))' };

  return {
    '--actions-panel-height': '116px',
    '--margin': '24px',
    '--width': `${isPortrait ? Math.floor(SIZE_LIMIT * aspectRatio) : SIZE_LIMIT}px`,
    '--height': `${isPortrait ? SIZE_LIMIT : Math.floor(SIZE_LIMIT / aspectRatio)}px`,
    position: 'absolute',
    ...verticalStyle,
    ...horizontalStyle,
    width: 'var(--width)',
    height: 'var(--height)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    zIndex: 10,
    backgroundColor: '#000',
    transitionProperty: 'left, top, width, height',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease-in-out'
  };
});

const LocalStream = styled(Stream)({
  objectFit: 'cover',
});

interface OngoingCallProps {
  userName: string;
  userAvatar?: string;
  isVideoCall?: boolean;
  remoteVideoStream?: MediaStream | null;
  localVideoStream?: MediaStream | null;
  onEndCall: () => void;
}

export const OngoingCall = ({
  userName,
  userAvatar,
  isVideoCall = false,
  remoteVideoStream: remoteVideoStreamProp = null,
  localVideoStream: localVideoStreamProp = null,
  onEndCall,
}: OngoingCallProps): JSX.Element => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [, setFacingMode] = useState<'user' | 'environment'>('user');
  const [showControls, setShowControls] = useState(false);
  const controlsVisibilityStateRef = useRef<{ lastMove: number, timeoutId?: ReturnType<typeof setTimeout> }>({ lastMove: 0 });
  const [localStreamPosition, setLocalStreamPosition] = useState<LocalStreamPosition>('bottom-right');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [remoteVideoStream, setRemoteVideoStream] = useState<MediaStream | null>(remoteVideoStreamProp);
  const [localVideoStream, setLocalVideoStream] = useState<MediaStream | null>(localVideoStreamProp);

  const [localStreamRatio, setLocalStreamRatio] = useState<number>(DEFAULT_ASPECT_RATIO);

  // useEffect(() => {
  //   if (localVideoStreamProp) return;

  //   navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(stream => setLocalVideoStream(stream));
  // }, [localVideoStreamProp]);

  useEffect(() => {
    if (remoteVideoStreamProp) return;

    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(stream => {
      setRemoteVideoStream(stream);
      setLocalVideoStream(stream);
    });
  }, [remoteVideoStreamProp]);

  // Подключаем локальный видеопоток к элементу video
  useEffect(() => {
    if (!localVideoRef.current || !localVideoStream) return;

    const video = localVideoRef.current;

    const handleResize = () => setLocalStreamRatio(video.videoWidth / video.videoHeight);

    video.addEventListener('resize', handleResize);

    video.srcObject = localVideoStream;

    return () => { video.removeEventListener('resize', handleResize); };
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
          <RemoteStream 
            ref={remoteVideoRef}
            autoPlay 
            playsInline
          />
        ) : (
          <>
            <CallAvatar src={userAvatar} alt={userName}>
              {userName.charAt(0).toUpperCase()}
            </CallAvatar>
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
        <LocalStreamContainer
          alignment={localStreamPosition}
          aspectRatio={localStreamRatio}
          onClick={() => setLocalStreamPosition(current => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const index = localStreamPositions.indexOf(current);

            if (index === -1) return localStreamPositions[0];

            const next = localStreamPositions[index + 1];

            return next || localStreamPositions[0];
          })
        }>
          <LocalStream
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
          />
        </LocalStreamContainer>
      {/* )} */}

      <ControlsContainer
        shown={showControls}
        spacing={3}
        direction="row"
      >
        <CallButton
          label="flip"
          onClick={handleSwitchCamera}
          aria-label="Flip camera"
          disabled={!isVideoCall}
        >
          <FlipCameraIcon />
        </CallButton>

        <CallButton
          label="video"
          onClick={handleToggleCamera}
          variant={isCameraOn ? 'active' : 'default'}
          aria-label={isCameraOn ? 'Disable video' : 'Enable video'}
          disabled={!isVideoCall}
        >
          {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
        </CallButton>

        <CallButton
          label="mute"
          onClick={handleToggleMic}
          variant={isMicOn ? 'active' : 'default'}
          aria-label={isMicOn ? 'Disable audio' : 'Enable audio'}
        >
          {isMicOn ? <MicIcon /> : <MicOffIcon />}
        </CallButton>

        <CallButton
          label="end"
          onClick={handleEndCall}
          variant="error"
          aria-label="End call"
        >
          <CloseIcon />
        </CallButton>
      </ControlsContainer>
    </CallContainer>
  );
};
