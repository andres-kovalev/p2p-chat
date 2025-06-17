import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';

export interface OnlineMarkerProps {
  isOnline?: boolean;
}

export function OnlineMarker({ isOnline }: OnlineMarkerProps) {
  return isOnline ? (
    <Typography color="success" component="span" variant="caption">
      online
      <Badge color="success" variant="dot" sx={{ ml: 1, top: -0.5 }} aria-hidden />
    </Typography>
  ) : (
    <Typography component="span" variant="caption">offline</Typography>
  );
}