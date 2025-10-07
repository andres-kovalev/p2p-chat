import { type JSX } from 'react';
import {
  Box,
  Avatar,
  Typography,
  styled,
} from '@mui/material';
import {
  CallEnd,
  Call
} from '@mui/icons-material';

import { useIsMobile } from '../hooks/useIsMobile';
import { CallButton } from './CallButton';

const IncomingCallContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#181c1f',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 1101,
});

const CallerBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '56px 48px 48px 48px'
});

const StyledAvatar = styled(Avatar)({
  width: 164,
  height: 164,
  marginBottom: 32,
  fontSize: 68,
});

interface ButtonsContainerProps {
  isMobile?: boolean;
}

const ButtonsContainer = styled('div')<ButtonsContainerProps>(({ isMobile }) => ({
  display: 'flex',
  gap: 96,
  width: '100%',
  justifyContent: isMobile ? 'space-between' : 'center',
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '32px 48px'
}));

interface IncomingCallProps {
  callerName: string;
  callerAvatar?: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCall = ({
  callerName,
  callerAvatar,
  onAccept,
  onDecline
}: IncomingCallProps): JSX.Element => {
  const isMobile = useIsMobile();

  return (
    <IncomingCallContainer>
      <CallerBox>
        <StyledAvatar src={callerAvatar} alt={callerName}>
          {callerName?.charAt(0).toUpperCase()}
        </StyledAvatar>
        <Typography variant="h4" color="white" fontWeight={600} gutterBottom>
          {callerName}
        </Typography>
        <Typography fontSize={18} color="rgba(255,255,255,0.7)" mt={2}>
          Incoming call
        </Typography>
      </CallerBox>
      <ButtonsContainer isMobile={isMobile}>
        <CallButton
          label="Decline"
          variant="error"
          size={96}
          onClick={onDecline}
          aria-label="Decline call"
        >
          <CallEnd sx={{ fontSize: 48 }} />
        </CallButton>
        <CallButton
          label="Accept"
          variant="active"
          size={96}
          onClick={onAccept}
          aria-label="Accept call"
        >
          <Call sx={{ fontSize: 48 }} />
        </CallButton>
      </ButtonsContainer>
    </IncomingCallContainer>
  );
};
