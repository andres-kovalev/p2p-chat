import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Stack, { StackProps } from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import { red } from '@mui/material/colors';
import ContrastIcon from '@mui/icons-material/Contrast';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ListSubheader from '@mui/material/ListSubheader';
import { useIsMobile } from '../hooks/useIsMobile';
import { RoomModel, RoomModelImpl } from '../models/Room';
import { PWABackgroundColor } from './PWABackgroundColor';
import { Peers } from './Peers';
import { Messages } from './Messages';
import { AvatarWithName } from './AvatarWithName';
import { useModel } from './ContainerProvider';
import { AppModel } from '../models/App';
import { useEscapeHandler } from '../hooks/useEscapeHandler';
import { useTheme } from '@mui/material/styles';

const APPBAR_BG_WITH_GRADIENT = '#272727';

const Row = (props: Omit<StackProps, 'direction'>) => <Stack {...props} direction="row" />

const Container = styled(Row)(() => ({
  width: '100dvw',
  height: '100dvh',
  maxWidth: '100%',
  minWidth: '100%',
  minHeight: '100%',
  maxHeight: '100%',
  justifyContent: 'start',
  alignItems: 'stretch',
}));

const PeersContainer = styled(Box)(({ theme }) => ({
  minWidth: 360,
  flexGrow: 1,
  [theme.breakpoints.up('md')]: {
    maxWidth: 500,
    flexGrow: 0,
  },
}));

export interface MainProps {
  onLogout: VoidFunction;
}

export const Main = observer(function Main({ onLogout }: MainProps) {
  const app = useModel(AppModel);
  const room: RoomModel = useModel(RoomModelImpl);

  const theme = useTheme();

  const isMobile = useIsMobile();

  const updateSize = useCallback((size: number) => {
    room.panelSize = size;
  }, [room]);
  const [ peersContainerRef, dividerRef ] = useHorizontalResize(room.panelSize, updateSize);

  const toggleSystemMode = () => app.setTheme(app.theme === 'system' ? 'light' : 'system');
  const toggleDarkMode = () => app.setTheme(app.theme === 'dark' ? 'light' : 'dark');

  const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement | null>(null);
  const isMenuShown = Boolean(menuAnchorElement);
  const hideMenu = () => setMenuAnchorElement(null);

  const isSelected = Boolean(room.current);

  const unselect = useCallback(() => {
    room.current = undefined;
  }, [room]);

  useEscapeHandler(unselect);

  return (
    <PWABackgroundColor color={app.isDarkTheme ? APPBAR_BG_WITH_GRADIENT : theme.palette.primary.main}>
      <Container>
        {(!isMobile || !isSelected) && (
          <>
            <PeersContainer ref={peersContainerRef}>
              <Peers
                name={room.name}
                devices={room.devices}
                onMenuClick={(event) => {
                  setMenuAnchorElement(event.currentTarget);
                }}
                onSelect={(device) => room.current = device}
              />
            </PeersContainer>
            <Divider
              component="div"
              orientation="vertical"
              flexItem
              sx={{
                position: 'relative',
                display: isMobile ? 'none' : undefined
              }}
              ref={dividerRef}
            />
          </>
        )}
        {isSelected && (
          <Box sx={{ flexGrow: 1 }}>
            <Messages
              device={room.current!}
              onBack={() => room.current = undefined}
            />
          </Box>
        )}
      </Container>

      <SwipeableDrawer
        anchor="left"
        open={isMenuShown && isMobile}
        disableSwipeToOpen
        onOpen={() => {}}
        onClose={hideMenu}
        slotProps={{ transition: {
          onExited: hideMenu
        } }}
      >
        <List sx={{ minWidth: 300 }}>
          <ListItem disablePadding sx={{ pointerEvents: 'none' }}>
            <ListItemButton>
              <ListItemIcon>
                <AvatarWithName name={room.roomName} size={32} />
              </ListItemIcon>
              <ListItemText primary={room.roomName} />
            </ListItemButton>
          </ListItem>
        </List>
        <List subheader={<ListSubheader sx={{ background: 'transparent' }}>Theme</ListSubheader>}>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleSystemMode}>
              <ListItemIcon>
                <ContrastIcon />
              </ListItemIcon>
              <ListItemText primary="System" id="system-mode-switch-label" />
              <Switch
                edge="end"
                checked={app.theme === 'system'}
                inputProps={{
                  'aria-labelledby': 'system-mode-switch-label',
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleDarkMode} disabled={app.theme === 'system'}>
              <ListItemIcon>
                <DarkModeIcon />
              </ListItemIcon>
              <ListItemText primary="Dark" id="dark-mode-switch-label" />
              <Switch
                edge="end"
                checked={app.theme === 'dark'}
                inputProps={{
                  'aria-labelledby': 'dark-mode-switch-label',
                }}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={onLogout} sx={{ color: red[500] }}>
              <ListItemIcon sx={{ color: red[500] }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </SwipeableDrawer>

      <Menu
        open={isMenuShown && !isMobile}
        onClose={hideMenu}
        anchorEl={menuAnchorElement}
      >
        <MenuItem sx={{ minWidth: 200, pointerEvents: 'none' }}>
          <ListItemIcon>
            <AvatarWithName name={room.roomName} size={24} />
          </ListItemIcon>
          <ListItemText>{room.roomName}</ListItemText>
        </MenuItem>
        <Divider />
        <ListSubheader sx={{ background: 'transparent' }}>Theme</ListSubheader>
        <MenuItem onClick={toggleSystemMode}>
          <ListItemIcon>
            <ContrastIcon />
          </ListItemIcon>
          <ListItemText id='system-mode-menu-switch-label'>System</ListItemText>
          <Switch
            edge="end"
            checked={app.theme === 'system'}
            inputProps={{
              'aria-labelledby': 'system-mode-menu-switch-label',
            }}
          />
        </MenuItem>
        <MenuItem onClick={toggleDarkMode} disabled={app.theme === 'system'}>
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>
          <ListItemText id='system-mode-menu-switch-label'>Dark</ListItemText>
          <Switch
            edge="end"
            checked={app.theme === 'dark'}
            inputProps={{
              'aria-labelledby': 'system-mode-menu-switch-label',
            }}
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogout} sx={{ color: red[500] }}>
          <ListItemIcon sx={{ color: red[500] }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </PWABackgroundColor>
  );
});

function useHorizontalResize<C extends HTMLElement, H extends HTMLElement = HTMLDivElement>(initialSize: number | undefined, onChange: (size: number) => void): [ RefObject<C | null>, RefObject<H | null> ] {
  const containerRef = useRef<C>(null);
  const dividerRef = useRef<H>(null);

  useLayoutEffect(() => {
    if (!dividerRef.current) return;

    if (!dividerRef.current.children.length) {
      dividerRef.current.appendChild(createHandle());
    }

    const container = containerRef.current;
    const updateSize = (size: number) => {
      if (container) {
        container.style.width = `${size}px`;
      }
    }
    if (initialSize) {
      updateSize(initialSize);
    }

    const handle = dividerRef.current.children[0] as HTMLDivElement;

    let dragging = false;
    let initialWidth = 0;
    let initialX = 0;

    const handleMouseDown = (event: MouseEvent) => {
      if (!container) return;

      cancelEvent(event);

      dragging = true;
      initialWidth = container.offsetWidth;
      initialX = event.clientX;
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!dragging) return;

      cancelEvent(event);
      dragging = false;
      onChange(initialWidth + event.clientX - initialX);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragging || !container) return;

      cancelEvent(event);
      updateSize(initialWidth + event.clientX - initialX);
    }

    handle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onChange]);

  return [ containerRef, dividerRef ];
}

function createHandle(): HTMLDivElement {
  const handle: HTMLDivElement = document.createElement('div');

  Object.assign(handle.style, {
    position: 'absolute',
    width: '5px',
    height: '100%',
    cursor: 'ew-resize',
  });

  return handle;
}

function cancelEvent(event: Event) {
  event.stopPropagation();
  event.preventDefault();
}
