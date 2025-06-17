import { JSX, MouseEventHandler, ReactNode, useState } from 'react';
import Card, { CardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { grey } from '@mui/material/colors';
import { Direction } from '../models/Message';

const OutlinedCard = (props: Omit<CardProps, 'variant'>) => <Card {...props} variant="outlined" />;

interface MessageCardProps {
  direction: Direction;
}

const MessageCard = styled(OutlinedCard)<MessageCardProps>(({ direction, theme }) => {
  const isSent = direction === 'sent';

  return [
    {
      position: 'relative',
      minWidth: 100,
      padding: theme.spacing(1),
      paddingBottom: 0,
      borderRadius: 12,
      overflow: 'visible',
      transition: 'transform 0.4s ease-in-out',
      alignSelf: isSent ? 'end' : 'start',
      color: isSent ? grey[50] : '#0a0a0a',
      background: isSent ? grey[900] : grey[100],
      ...(isSent
        ? { borderBottomRightRadius: 0 }
        : { borderBottomLeftRadius: 0 }),
      '&.touching': {
        userSelect: 'none',
        transform: 'scale(0.9)',
      }
    },
    theme.applyStyles('dark', {
      color: isSent ? grey[900] : grey[50],
      background: isSent ? grey[300] : grey[900],
    }),
  ];
});

const Timestamp = styled(Typography)(() => ({
  opacity: 0.7,
  alignSelf: 'end',
  float: 'right',
}));

interface MoreButtonProps {
  direction: Direction;
}

const MoreButton = styled(IconButton)<MoreButtonProps>(({ direction, theme }) => {
  const isSent = direction === 'sent';
  const background = isSent ? grey[900] : grey[100];
  const darkBackground = isSent ? grey[300] : grey[900];

  return [
    {
      position: 'absolute',
      width: 24,
      height: 24,
      bottom: 0,
      background,
      opacity: 0,
      transition: 'opacity 0.3s',
      ...(isSent
        ? { left: -20 }
        : { right: -20 }),
      boxShadow: theme.shadows[1],
      '*:hover > &': {
        background,
        opacity: 1
      },
      [theme.breakpoints.down('lg')]: {
        display: 'none',
      },
    },
    theme.applyStyles('dark', {
      background: darkBackground,
      '*:hover > &': {
        background: darkBackground,
      }
    }),
  ]
});

export interface ContextAction {
  icon?: JSX.Element;
  label: string;
  callback: VoidFunction;
  color?: string;
}

export interface MessageBubbleProps extends CardProps, MessageCardProps {
  children: ReactNode;
  timestamp: number;
  contextActions?: ContextAction[];
}

interface MenuPosition {
  top: number;
  left: number;
};

export function MessageBubble({ direction, children, timestamp, contextActions, ...restProps }: MessageBubbleProps) {
  const [touchPosition, setTouchPosition] = useState<MenuPosition | null>(null);
  const endTouch = () => setTouchPosition(null);

  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const hideMenu = () => setMenuPosition(null);

  const hasActions = Boolean(contextActions?.length);

  const handleContextMenu: MouseEventHandler = (event) => {
    if (!hasActions) return;

    event.preventDefault();

    setMenuPosition(getMenuPosition(event));

    // Prevent text selection lost after opening the context menu on Safari and Firefox
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      setTimeout(() => {
        selection.addRange(range);
      });
    }
  };

  return (
    <>
      <MessageCard
        {...restProps}
        direction={direction}
        className={touchPosition ? 'touching' : undefined}
        onContextMenu={handleContextMenu}
        onTouchStart={event => {
          if (!event.touches.length) return;

          setTouchPosition(getMenuPosition(event.touches[0]));
        }}
        onTouchEnd={endTouch}
        onTouchMove={endTouch}
        onTouchCancel={endTouch}
        onTransitionEnd={(event) => {
          if (!touchPosition || event.target !== event.currentTarget) return;

          setMenuPosition(touchPosition);
          setTouchPosition(null);
        }}
      >
        <div>
          {children}
          <Timestamp variant="caption">{formatTime(timestamp)}</Timestamp>
        </div>
        {hasActions && (
          <MoreButton direction={direction} color="inherit" onClick={event => {
            event.stopPropagation();

            setMenuPosition({
              left: event.clientX + 2,
              top: event.clientY - 6,
            });
          }}>
            <MoreHorizIcon />
          </MoreButton>
        )}
      </MessageCard>
      {hasActions && (
        <Menu
          open={Boolean(menuPosition)}
          onClose={hideMenu}
          anchorReference="anchorPosition"
          anchorPosition={menuPosition ?? undefined}
          transformOrigin={{
            vertical: 'top',
            horizontal: direction === 'sent' ? 'right' : 'left',
          }}
          slotProps={{
            list: {
              dense: true,
            },
          }}
        >
          {contextActions!.map(({ icon, label, callback, color }, index) => (
            <MenuItem key={index} onClick={() => {
              callback();
              hideMenu();
            }} >
              {icon && <ListItemIcon sx={{ color }}>{icon}</ListItemIcon>}
              <ListItemText sx={{ color }}>{label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  )
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);

  return [date.getHours(), date.getMinutes()]
    .map(number => number.toString().padStart(2, '0'))
    .join(':');
}

interface ClientPosition {
  clientX: number;
  clientY: number;
}

function getMenuPosition(clientPosition: ClientPosition): MenuPosition {
  return {
    left: clientPosition.clientX + 2,
    top: clientPosition.clientY - 6,
  };
}