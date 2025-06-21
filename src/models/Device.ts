import { type Disposable } from 'tsyringe';
import { autorun, makeAutoObservable } from 'mobx';
import { MessageModel, createTextMessage, createFileMessage } from "./Message";
import { RoomService } from '../services/RoomService';
import { createFileFromFile, createFileFromMetadata } from './File';

export interface DeviceModel extends Disposable {
  readonly peerId: string;

  name: string;

  isOnline?: boolean;

  messages: MessageModel[];

  updates: number;

  sendText(text: string): void;

  sendFile(file: File): void;

  removeMessage(message: MessageModel): void;

  select(): void;

  unselect(): void;
}

export function createDevice(roomService: RoomService, peerId: string, deviceId: string) {
  return new DeviceModelImpl(roomService, peerId, deviceId);
}

class DeviceModelImpl implements DeviceModel {
  #disposals: VoidFunction[] = [];
  #unobserve: VoidFunction | undefined = undefined;

  private _isOnline = true;

  public get isOnline() {
    return this._isOnline;
  }

  public set isOnline(value: boolean) {
    if (this._isOnline && !value) {
      for(const message of this.messages) {
        if (message.content.type !== 'file') continue;

        message.content.file.break();
      }
    }

    this._isOnline = value;
  }

  public readonly messages: MessageModel[] = [];

  private seen = 0;

  public get updates() {
    return this.messages.length - this.seen;
  }

  constructor(
    private readonly roomService: RoomService,
    public readonly peerId: string,
    public name: string
  ) {
    this.#disposals.push(
      this.roomService.onDeviceNameReceived(deviceName => this.name = deviceName, peerId),
      this.roomService.onTextReceived((text) => {
        this.messages.push(createTextMessage('received', text));
      }, peerId),
      this.roomService.onFileRequestReceived(({ type, ...metadata }) => {
        if (type === 'send') {
          this.messages.push(
            createFileMessage('received', createFileFromMetadata(roomService, peerId, metadata))
          );
        }
      }, peerId)
    );

    makeAutoObservable(this);
  }

  sendText(text: string) {
    if (!this.isOnline) return;

    this.messages.push(createTextMessage('sent', text));

    return this.roomService.sendText(text, this.peerId);
  }

  async sendFile(file: File) {
    if (!this.isOnline) return;

    this.messages.push(
      createFileMessage('sent', createFileFromFile(this.roomService, this.peerId, file))
    );
  }

  removeMessage(message: MessageModel): void {
    const index = this.messages.indexOf(message);

    if (index !== -1) {
      this.messages.splice(index, 1)[0].dispose();
    }
  }

  dispose(): void {
    this.unselect();

    this.#disposals.forEach(dispose => dispose());

    this.messages.forEach(messages => messages.dispose());
  }

  select() {
    this.unselect();

    this.#unobserve = autorun(() => {
      this.seen = this.messages.length;
    });
  }

  unselect() {
    this.#unobserve?.();
    this.#unobserve = undefined;
  }
}
