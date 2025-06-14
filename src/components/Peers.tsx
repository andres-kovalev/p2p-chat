import { Fragment, MouseEvent, MouseEventHandler } from 'react';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import { DeviceModel } from '../models/Device';
import Link from '@mui/material/Link';

interface PeersProps {
  roomName: string;
  devices: DeviceModel[];
  onMenuClick?: MouseEventHandler<HTMLButtonElement>;
  onRenameClick?: MouseEventHandler<HTMLElement>;
  onSelect?: (device: DeviceModel) => void;
  onDeviceMenuClick?: (device: DeviceModel, event: MouseEvent) => void;
}

export function Peers({ roomName, devices, onMenuClick, onRenameClick, onSelect, onDeviceMenuClick }: PeersProps) {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
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
                {roomName}
              </Link>
              <IconButton color="inherit" onClick={onRenameClick}>
                <EditIcon />
              </IconButton>
            </>
          ) : (
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              {roomName}
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      <List sx={{ width: '100%', minWidth: 360, margin: 0, padding: 0 }}>
        {devices.map((device) => (
          <Fragment key={device.peerId}>
            <ListItem disablePadding secondaryAction={onDeviceMenuClick && (
              <IconButton aria-label="Actions" onClick={event => onDeviceMenuClick(device, event)}>
                <MoreHorizIcon />
              </IconButton>
            )}>
              <ListItemButton onClick={() => onSelect?.(device)}>
                <ListItemAvatar>
                  <Avatar>VK</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={device.deviceId}
                  secondary={
                    <>
                      {device.isOnline ? <>online <Badge color="success" variant="dot" sx={{ ml: 0.5, top: -1 }} aria-hidden /></> : 'offline'}
                    </>
                  }
                />
                {device.hasUpdates && <Badge color="info" badgeContent=" " sx={{ mr: 3 }} aria-label="Has updates" />}
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
          </Fragment>
        ))}
      </List>
    </>
  );
};