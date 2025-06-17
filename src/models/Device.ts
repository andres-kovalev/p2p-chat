import { MessageModel } from "./Message";

export interface DeviceModel {
  readonly peerId: string;

  name: string;

  isOnline?: boolean;

  hasUpdates?: boolean;

  messages: MessageModel[];

  sendText(text: string): void;

  sendFile(file: File): void;

  removeMessage(message: MessageModel): void;
}