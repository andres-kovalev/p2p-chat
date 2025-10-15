import Stack from '@mui/material/Stack';
import { styled } from '@mui/material';

export const CallActionsContainer = styled(Stack)({
  justifyContent: 'center',
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  padding: 32
});