import { Fragment, MouseEvent, type MouseEventHandler } from 'react';
import { observer } from 'mobx-react-lite';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import { DeviceModel } from '../models/Device';
import Link from '@mui/material/Link';
import { AvatarWithName } from './AvatarWithName';
import { ChatToolbar } from './ChatToolbar';
import { LastMessageText } from './LastMessageText';
import { styled } from '@mui/material/styles';

const PeersList = styled(List)(() => ({
  width: '100%',
  margin: 0,
  padding: 0,
}));

export interface PeersProps {
  name: string;
  devices: DeviceModel[];
  onMenuClick?: MouseEventHandler<HTMLButtonElement>;
  onRenameClick?: MouseEventHandler<HTMLElement>;
  onSelect?: (device: DeviceModel) => void;
  onDeviceMenuClick?: (device: DeviceModel, event: MouseEvent) => void;
}

export const Peers = observer(function Peers({ name, devices, onMenuClick, onRenameClick, onSelect, onDeviceMenuClick }: PeersProps) {
  return (
    <>
      <AppBar position="sticky">
        <ChatToolbar>
          {onMenuClick && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="Menu"
              sx={{ mr: 2 }}
              onClick={onMenuClick}
            >
              <MenuIcon />
            </IconButton>
          )}
          {onRenameClick ? (
            <>
              <Link
                color="inherit"
                underline="none"
                variant="h6"
                component="h1"
                sx={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={onRenameClick}
              >
                {name}
              </Link>
              <IconButton color="inherit" onClick={onRenameClick}>
                <EditIcon />
              </IconButton>
            </>
          ) : (
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              {name}
            </Typography>
          )}
        </ChatToolbar>
      </AppBar>
      <PeersList>
        {devices.map((device) => (
          <Fragment key={device.peerId}>
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
          </Fragment>
        ))}
      </PeersList>
    </>
  );
});
