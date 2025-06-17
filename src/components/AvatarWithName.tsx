import Avatar from '@mui/material/Avatar';

export interface AvatarWithNameProps {
  name: string;
}

export function AvatarWithName({ name }: AvatarWithNameProps) {
  return (
    <Avatar>
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