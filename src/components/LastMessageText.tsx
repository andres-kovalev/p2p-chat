import { observer } from 'mobx-react-lite';
import { MessageModel } from '../models/Message';
import { FileModel } from '../models/File';
import { expectNever } from '../utils/expect';
import { styled } from '@mui/material/styles';

const TextClamp = styled('div')(() => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export interface LastMessageTextProps {
  message: MessageModel;
}

export const LastMessageText = observer(function LastMessageText({ message }: LastMessageTextProps) {
  switch (message.content.type) {
    case 'text':
      return <TextClamp>{message.content.text}</TextClamp>;

    case 'file':
      return <TextClamp>{message.content.file.name} {getFileStatusIcon(message.content.file.status)}</TextClamp>;

    default:
      return expectNever(message.content);
  }
});

function getFileStatusIcon(status: FileModel['status']): string {
  switch (status.state) {
    case 'incoming':
    case 'outgoing':
      return '⏳';

    case 'sending':
      return `⬆️ ${status.progress}%`;

    case 'receiving':
      return `⬇️ ${status.progress}%`;

    case 'sent':
    case 'received':
      return '✅';

    case 'rejected':
    case 'cancelled':
    case 'broken':
      return '❌';

    default:
      return expectNever(status);
  }
}