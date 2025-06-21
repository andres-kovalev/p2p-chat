import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const OnlineBadge = styled(Badge)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  top: -0.5,
}))

export interface OnlineMarkerProps {
  isOnline?: boolean;
}

export function OnlineMarker({ isOnline }: OnlineMarkerProps) {
  return isOnline ? (
    <Typography color="success" component="span" variant="caption">
      online
      <OnlineBadge color="success" variant="dot" aria-hidden />
    </Typography>
  ) : (
    <Typography component="span" variant="caption">offline</Typography>
  );
}