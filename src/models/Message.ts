import { FileModel } from './File';

export type Direction = 'sent' | 'received';

type MessageContent = { type: 'text', text: string } | { type: 'file', file: FileModel };

export interface MessageModel {
  direction: Direction;

  timestamp: number;

  content: MessageContent;
}