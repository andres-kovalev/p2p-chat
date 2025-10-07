import { MouseEvent } from 'react';
import { observer } from 'mobx-react-lite';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { DeviceModel } from '../models/Device';
import { AvatarWithName } from './AvatarWithName';
import { LastMessageText } from './LastMessageText';

export interface PeerProps {
  device: DeviceModel;
  onSelect?: (device: DeviceModel) => void;
  onDeviceMenuClick?: (device: DeviceModel, event: MouseEvent) => void;
}

export const Peer = observer(function Peer({ device, onSelect, onDeviceMenuClick }: PeerProps) {
  return (
    <>
      <ListItem disablePadding secondaryAction={onDeviceMenuClick && (
        <IconButton aria-label="Actions" onClick={event => onDeviceMenuClick(device, event)}>
        <MoreHorizIcon />
        </IconButton>
      )}>
        <ListItemButton onClick={() => onSelect?.(device)}>
        <ListItemAvatar>
          <AvatarWithName name={device.name} isOnline={device.isOnline} />
        </ListItemAvatar>
        <ListItemText
          primary={device.name}
          secondary={Boolean(device.messages.length) && <LastMessageText message={device.messages[device.messages.length - 1]} />}
        />
        {Boolean(device.updates) && <Badge color="primary" badgeContent={device.updates} sx={{ mr: 3 }} aria-label={`Updates: ${device.updates}`} />}
        </ListItemButton>
      </ListItem>
      <Divider component="li" />
    </>
  );
});
