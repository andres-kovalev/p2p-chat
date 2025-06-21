import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';

export interface AvatarWithNameProps {
  name: string;
  isOnline?: boolean;
  size?: number;
}

export function AvatarWithName({ name, isOnline, size }: AvatarWithNameProps) {
  const avatar = (
    <Avatar sx={size ? { width: size, height: size } : undefined}>
      {getShortName(name)}
    </Avatar>
  );

  return isOnline ? (
    <Badge
      badgeContent=" "
      variant="dot"
      color="success"
      overlap="circular"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      {avatar}
    </Badge>
  ) : avatar;
}

function getShortName(name: string) {
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map(
      word => word.replace(/\W/g, '').charAt(0).toUpperCase()
    )
    .join('');
}
