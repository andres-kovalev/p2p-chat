import Box from '@mui/material/Box';
import Stack, { StackProps } from '@mui/material/Stack';
import { AvatarWithName } from './AvatarWithName';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Peers } from './Peers';
import { Messages } from './Messages';
import { RoomModel } from '../models/Room';
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
  room: RoomModel;
  onLogout: VoidFunction;
}

export function Main({ room, onLogout }: MainProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [ peersContainerRef, dividerRef ] = useHorizontalResize();

  const [mode, setMode] = useState<'system' | 'light' | 'dark'>('system');
  const toggleSystemMode = () => setMode(mode === 'system' ? 'light' : 'system');
  const toggleDarkMode = () => setMode(mode === 'dark' ? 'light' : 'dark');

  const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement | null>(null);
  const isMenuShown = Boolean(menuAnchorElement);
  const hideMenu = () => setMenuAnchorElement(null);

  const isSelected = Boolean(room.current);

  return (
    <>
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
              sx={{ position: 'relative' }}
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
        <List subheader={<ListSubheader>Theme</ListSubheader>}>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleSystemMode}>
              <ListItemIcon>
                <ContrastIcon />
              </ListItemIcon>
              <ListItemText primary="System" id="system-mode-switch-label" />
              <Switch
                edge="end"
                checked={mode === 'system'}
                inputProps={{
                  'aria-labelledby': 'system-mode-switch-label',
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleDarkMode}>
              <ListItemIcon>
                <DarkModeIcon />
              </ListItemIcon>
              <ListItemText primary="Dark" id="dark-mode-switch-label" />
              <Switch
                edge="end"
                // onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                checked={mode === 'dark'}
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
        <ListSubheader>Theme</ListSubheader>
        <MenuItem onClick={toggleSystemMode}>
          <ListItemIcon>
            <ContrastIcon />
          </ListItemIcon>
          <ListItemText id='system-mode-menu-switch-label'>System</ListItemText>
          <Switch
            edge="end"
            checked={mode === 'system'}
            inputProps={{
              'aria-labelledby': 'system-mode-menu-switch-label',
            }}
          />
        </MenuItem>
        <MenuItem onClick={toggleDarkMode} disabled={mode === 'system'}>
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>
          <ListItemText id='system-mode-menu-switch-label'>Dark</ListItemText>
          <Switch
            edge="end"
            checked={mode === 'dark'}
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
    </>
  );
}

function useHorizontalResize<C extends HTMLElement, H extends HTMLElement = HTMLDivElement>(): [ RefObject<C | null>, RefObject<H | null> ] {
  const containerRef = useRef<C>(null);
  const dividerRef = useRef<H>(null);

  useEffect(() => {
    if (!dividerRef.current) return;

    if (!dividerRef.current.children.length) {
      dividerRef.current.appendChild(createHandle());
    }

    const container = containerRef.current;
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
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragging || !container) return;

      cancelEvent(event);
      container.style.width = `${initialWidth + event.clientX - initialX}px`;
    }

    handle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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