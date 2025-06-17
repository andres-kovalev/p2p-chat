import { MessageModel } from '../../models/Message';
import { TextMessage } from './TextMessage';
import { FileMessage } from './FileMessage';
import { expectNever } from '../../utils/expect';

export interface MessageProps {
  message: MessageModel;
  onDelete: VoidFunction;
}

export function Message({ message, onDelete }: MessageProps) {
  switch (message.content.type) {
    case 'text':
      return (
        <TextMessage
          direction={message.direction}
          timestamp={message.timestamp}
          onDelete={onDelete}
        >
          {message.content.text}
        </TextMessage>
      );

    case 'file':
      return (
        <FileMessage
          direction={message.direction}
          timestamp={message.timestamp}
          file={message.content.file}
          onDelete={onDelete}
        />
      );

    default:
      return expectNever(message.content);
  }
}