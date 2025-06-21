import { scoped, inject, Lifecycle, type Disposable } from "tsyringe";
import { joinRoom, type ActionSender, type DataPayload, type Room } from "trystero";
import type { Credentials, FileMetadata } from "../types";
import { assertField, assertNumber, assertObject, assertStringField } from "../utils/assert";
import { createPeerEventEmitter, type PeerEventEmitter, type PeerListener } from "../utils/p2p";

const APP_PREFIX = 'p2p-chat:';
const ROOM_NAME = 'common-room';

type Callback<T extends unknown[]> = (...args: T) => void;

type Advice = {
  type: 'rename';
  name: string;
};

export type FileRequest = FileMetadata & {
  type: 'send' | 'accept' | 'reject' | 'cancel';
}

@scoped(Lifecycle.ContainerScoped)
export class RoomService implements Disposable {
  #room: Room;
  #sendDeviceName: ActionSender<string>;
  #onDeviceNameReceived: PeerEventEmitter<string>;
  #sendAdvice: ActionSender<Advice>;
  #onAdviceReceived: PeerEventEmitter<Advice>;
  #sendText: ActionSender<string>;
  #onTextReceived: PeerEventEmitter<string>;
  #sendFileRequest: ActionSender<FileRequest>;
  #onFileRequestReseived: PeerEventEmitter<FileRequest>;
  #sendFile: ActionSender<ArrayBuffer>;
  #onFileReceived: PeerEventEmitter<ArrayBuffer>;
  #onFileProgress: PeerEventEmitter<number>;

  #createAction<T extends DataPayload>(name: string): [ ActionSender<T>, PeerEventEmitter<T>, PeerEventEmitter<number> ] {
    const action = this.#room.makeAction<T>(name);

    return [action[0], createPeerEventEmitter(action[1]), createPeerEventEmitter(action[2]) ];
  }

  constructor(@inject('Credentials') credentials: Credentials) {
    this.#room = joinRoom({ appId: `${APP_PREFIX}${credentials.login}`, password: credentials.hash }, ROOM_NAME);

    this.#room.onPeerJoin((...args) => {
      console.log(args);
    });

    [ this.#sendDeviceName, this.#onDeviceNameReceived ] = this.#createAction<string>('deviceName');
    [ this.#sendAdvice, this.#onAdviceReceived ] = this.#createAction<Advice>('advice');
    [ this.#sendText, this.#onTextReceived ] = this.#createAction<string>('text');
    [ this.#sendFileRequest, this.#onFileRequestReseived ] = this.#createAction<FileRequest>('fileRequest');
    [ this.#sendFile, this.#onFileReceived, this.#onFileProgress ] = this.#createAction<ArrayBuffer>('file');
  }

  onJoin(listener: Callback<[peerId: string]>) {
    this.#room.onPeerJoin(listener);
  }

  onLeave(listener: Callback<[peerId: string]>) {
    this.#room.onPeerLeave(listener);
  }

  sendDeviceName(deviceName: string, peerId?: string) {
    return this.#sendDeviceName(deviceName, peerId);
  }

  onDeviceNameReceived(listener: PeerListener<string>, peerId?: string) {
    return this.#onDeviceNameReceived.on(listener, peerId);
  }

  sendAdvice(advice: Advice, peerId: string) {
    return this.#sendAdvice(advice, peerId);
  }

  onAdviceReceived(listener: PeerListener<Advice>, peerId?: string) {
    return this.#onAdviceReceived.on(listener, peerId);
  }

  sendText(text: string, peerId: string) {
    return this.#sendText(text, peerId);
  }

  onTextReceived(listener: PeerListener<string>, peerId?: string) {
    return this.#onTextReceived.on(listener, peerId)
  }

  sendFileRequest(request: FileRequest, peerId: string) {
    return this.#sendFileRequest(request, peerId);
  }

  onFileRequestReceived(listener: PeerListener<FileRequest>, peerId?: string) {
    return this.#onFileRequestReseived.on(listener, peerId);
  }

  sendFile(buffer: ArrayBuffer, metadata: FileMetadata, peerId: string, progress: (percent: number) => void) {
    return this.#sendFile(buffer, peerId, metadata, progress);
  }

  onFileReceived(listener: PeerListener<ArrayBuffer, FileMetadata>, peerId: string, fileId: string) {
    return this.#onFileReceived.on((data, peerId, metadata) => {
      assertFileMetadata(metadata);

      if (metadata.id === fileId) listener(data, peerId, metadata);
    }, peerId);
  }

  onFileProgress(listener: PeerListener<number, FileMetadata>, peerId: string, fileId: string) {
    return this.#onFileProgress.on((percent, peerId, metadata) => {
      assertFileMetadata(metadata);

      if (metadata.id === fileId) listener(percent, peerId, metadata);
    }, peerId);
  }

  dispose() {
    this.#room.leave();
  }
}

export function assertFileMetadata(
  value: unknown,
  name: string = 'value'
): asserts value is FileMetadata {
  assertObject(value, name);

  assertStringField(value, 'id', name);
  assertStringField(value, 'name', name);
  assertStringField(value, 'mimeType', name);

  assertField(value, 'size', name);
  assertNumber(value.size, `${name}.size`);
}
