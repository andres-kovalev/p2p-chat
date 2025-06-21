import Avatar from '@mui/material/Avatar';

export interface AvatarWithNameProps {
  name: string;
  size?: number;
}

export function AvatarWithName({ name, size }: AvatarWithNameProps) {
  return (
    <Avatar sx={size ? { width: size, height: size } : undefined}>
      {getShortName(name)}
    </Avatar>
  );
}

function getShortName(name: string) {
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map(
      word => word.charAt(0).toUpperCase()
    )
    .join('');
}