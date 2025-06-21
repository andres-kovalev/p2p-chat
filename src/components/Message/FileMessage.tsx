import { FileModel } from "../../models/File";
import { MessageBubble, type MessageBubbleProps, type ContextAction } from "../MessageBubble";
import { grey, red } from '@mui/material/colors';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { expectNever } from "../../utils/expect";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckIcon from '@mui/icons-material/Check';
import { downloadFile } from '../../utils/file';

const File = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
}));

const ActionContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(0.5),
}));

const ActionIcon = styled(IconButton)(({ theme }) => ([
  {
    width: 48,
    height: 48,
    color: grey[50],
    background: grey[800],
    zIndex: 2,
    '&:hover': {
      background: grey[800],
    }
  },
  theme.applyStyles('dark', {
    color: grey[900],
    background: grey[500],
    '&:hover': {
      background: grey[500],
    }
  }),
]));

const Progress = styled(CircularProgress)(() => ({
  position: 'absolute',
  left: 0,
  top: 0
}));

const Size = styled(Typography)(() => ({
  opacity: 0.7
}));

export interface FileMessageProps extends Omit<MessageBubbleProps, 'children'> {
  file: FileModel;
  onDelete: VoidFunction;
}

export function FileMessage({ file, onDelete, ...restProps }: FileMessageProps) {
  const defaultActions: ContextAction[] = [{
    icon: <DeleteOutlineIcon />,
    label: 'Delete',
    callback: onDelete,
    color: red[500],
  }];

  return (
    <MessageBubble {...restProps} contextActions={getContextActions().concat(defaultActions)}>
      <File direction="row">
        <ActionContainer>
          {renderAction()}
          {renderProgress()}
        </ActionContainer>
        <Stack direction="column">
          <Typography>{file.name}</Typography>
          <Size variant="caption">{formatSize(file.size)}</Size>
        </Stack>
      </File>
    </MessageBubble>
  );

  function renderAction() {
    switch (file.status.state) {
      case 'incoming':
        return (
          <ActionIcon aria-label="Accept file" onClick={() => file.accept()}>
            <ArrowDownwardIcon />
          </ActionIcon>
        );

      case 'outgoing':
      case 'sending':
      case 'receiving':
        return (
          <ActionIcon aria-label="Cancel file transmission" onClick={() => file.cancel()}>
            <CloseRoundedIcon />
          </ActionIcon>
        );

      case 'sent':
        return (
          <ActionIcon aria-label="Sent successfully" sx={{ cursor: 'default' }}>
            <CheckIcon />
          </ActionIcon>
        );

      case 'received': {
        const { content } = file.status;

        return (
          <ActionIcon aria-label="Download file" onClick={() => downloadFile(file.name, file.mimeType, content)}>
            <FilePresentIcon />
          </ActionIcon>
        );
      }

      case 'rejected':
      case 'cancelled':
      case 'broken':
        return (
          <ActionIcon aria-label="Remove file" onClick={onDelete}>
            <DeleteOutlineIcon />
          </ActionIcon>
        );

      default:
        return expectNever(file.status);
    }
  }

  function renderProgress() {
    switch (file.status.state) {
      case 'outgoing':
        return <Progress size={56} color="inherit" />;

      case 'incoming':
        return null;

      case 'sending':
      case 'receiving':
        return <Progress size={56} color="inherit" variant="determinate" value={Math.round(file.status.progress * 100)} />;

      case 'sent':
      case 'received':
      case 'rejected':
      case 'cancelled':
      case 'broken':
        return null;

      default:
        return expectNever(file.status);
    }
  }

  function getContextActions(): ContextAction[] {
    switch (file.status.state) {
      case 'incoming':
        return [
          {
            icon: <ArrowDownwardIcon />,
            label: 'Accept',
            callback: () => file.accept(),
          },
          {
            icon: <CloseRoundedIcon />,
            label: 'Reject',
            callback: () => file.reject(),
          }
        ];

      case 'outgoing':
      case 'sending':
      case 'receiving':
        return [{
          icon: <CloseRoundedIcon />,
          label: 'Cancel',
          callback: () => file.cancel(),
        }];

      case 'received': {
        const { content } = file.status;

        return [{
          icon: <FilePresentIcon />,
          label: 'Download',
          callback: () => downloadFile(file.name, file.mimeType, content)
        }];
      }

      case 'sent':
      case 'rejected':
      case 'cancelled':
      case 'broken':
        return [];

      default:
        return expectNever(file.status);
    }
  }
}

export function formatSize(bites: number): string {
  if (bites < 1024) return `${bites}B`;

  const kbs = bites / 1024;

  if (kbs < 1024) return `${kbs.toFixed(0)}K`;

  const mbs = kbs / 1024;

  if (mbs < 1024) return `${mbs.toFixed(0)}M`;

  return `${(mbs / 1024).toFixed(0)}G`;
}
