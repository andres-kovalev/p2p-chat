import { type Disposable } from 'tsyringe';
import { FileModel } from './File';

export type Direction = 'sent' | 'received';

type MessageContent = { type: 'text', text: string } | { type: 'file', file: FileModel };

export interface MessageModel extends Disposable {
  direction: Direction;

  timestamp: number;

  content: MessageContent;
}

export function createTextMessage(direction: Direction, text: string): MessageModel {
  return {
    direction,
    timestamp: Date.now(),
    content: {
      type: 'text',
      text,
    },
    dispose() {}
  };
}

export function createFileMessage(direction: Direction, file: FileModel): MessageModel {
  return {
    direction,
    timestamp: Date.now(),
    content: {
      type: 'file',
      file,
    },
    dispose() {
      file.dispose();
    }
  };
}