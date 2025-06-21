import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';

export const ChatToolbar = styled(Toolbar)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));
