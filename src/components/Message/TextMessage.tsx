import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { MessageBubble, type MessageBubbleProps } from "../MessageBubble";
import { useCopyToClipboard } from '../CopyProvider';
import { grey, red } from '@mui/material/colors';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Direction } from '../../models/Message';

const Content = styled('pre')(() => ({
  margin: 0,
  maxWidth: '100%',
  whiteSpace: 'normal',
}));

interface CopyButtonProps {
  direction: Direction;
}

const CopyButton = styled(Chip)<CopyButtonProps>(({ direction, theme }) => {
  const isSent = direction === 'sent';

  return [
    {
      float: 'right',
      marginLeft: theme.spacing(1),
      opacity: 0.5,
      padding: 1,
      transition: 'opacity 0.3s',
      '*:hover > &, &:hover': {
        opacity: 1
      },
      color: isSent ? grey[50] : '#0a0a0a',
      backgroundColor: isSent ? grey[800] : grey[300],
    },
    theme.applyStyles('dark', {
      color: isSent ? grey[900] : grey[50],
      backgroundColor: isSent ? grey[300] : grey[800],
    }),
  ];
});

export interface TextMessageProps extends Omit<MessageBubbleProps, 'children'> {
  children: string;
  onDelete: VoidFunction;
}

export function TextMessage({ direction, children, onDelete, ...restProps }: TextMessageProps) {
  const copyToClipboard = useCopyToClipboard();

  return (
    <MessageBubble
      direction={direction}
      {...restProps}
      sx={{ cursor: 'pointer' }}
      onClick={() => copyToClipboard(children)}
      contextActions={[
        {
          icon: <ContentCopyIcon />,
          label: 'Copy to clipboard',
          callback: () => copyToClipboard(children)
        },
        {
          icon: <DeleteOutlineIcon />,
          label: 'Delete',
          callback: onDelete,
          color: red[500]
        }
      ]}
    >
      <CopyButton direction={direction} size="small" icon={<ContentCopyIcon color="inherit" />} label="copy" />
      <Content>
        {children}
      </Content>
    </MessageBubble>
  );
}
