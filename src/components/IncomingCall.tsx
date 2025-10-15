import { type JSX } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useIsMobile } from '../hooks/useIsMobile';
import { CallContainer } from './CallContainer';
import { CallButton } from './CallButton';
import { CallAvatar } from './CallAvatar';
import { CallActionsContainer } from './CallActionsContainer';

const Container = styled(CallContainer)({
  alignItems: 'center',
  justifyContent: 'center',
});

const CallerBox = styled(Stack)({
  alignItems: 'center',
  justifyContent: 'center',
  padding: '56px 48px 48px 48px'
});

interface ButtonsContainerProps {
  isMobile?: boolean;
}

const ButtonsContainer = styled(CallActionsContainer)<ButtonsContainerProps>(({ isMobile }) => ({
  width: '100%',
  justifyContent: isMobile ? 'space-between' : 'center',
}));

interface IncomingCallProps {
  callerName: string;
  callerAvatar?: string;
  onAccept: VoidFunction;
  onDecline: VoidFunction;
}

export const IncomingCall = ({
  callerName,
  callerAvatar,
  onAccept,
  onDecline
}: IncomingCallProps): JSX.Element => {
  const isMobile = useIsMobile();

  return (
    <Container>
      <CallerBox>
        <CallAvatar src={callerAvatar} alt={callerName}>
          {callerName?.charAt(0).toUpperCase()}
        </CallAvatar>
        <Typography variant="h4" color="white" fontWeight={600} gutterBottom>
          {callerName}
        </Typography>
        <Typography fontSize={18} color="rgba(255,255,255,0.7)" mt={2}>
          Incoming call
        </Typography>
      </CallerBox>
      <ButtonsContainer
        direction="row"
        spacing={12}
        isMobile={isMobile}
      >
        <CallButton
          label="Decline"
          variant="error"
          size={80}
          onClick={onDecline}
          aria-label="Decline call"
        >
          <CloseIcon sx={{ fontSize: 48 }} />
        </CallButton>
        <CallButton
          label="Accept"
          variant="active"
          size={80}
          onClick={onAccept}
          aria-label="Accept call"
        >
          <CheckIcon sx={{ fontSize: 48 }} />
        </CallButton>
      </ButtonsContainer>
    </Container>
  );
};
