import { MouseEvent, type MouseEventHandler } from 'react';
import { observer } from 'mobx-react-lite';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import { DeviceModel } from '../models/Device';
import Link from '@mui/material/Link';
import { ChatToolbar } from './ChatToolbar';
import { styled } from '@mui/material/styles';
import { Peer } from './Peer';

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
          <Peer
            key={device.peerId}
            device={device}
            onSelect={onSelect}
            onDeviceMenuClick={onDeviceMenuClick}
          />
        ))}
      </PeersList>
    </>
  );
});
