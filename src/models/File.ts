import { type Disposable } from 'tsyringe';
import { makeAutoObservable } from 'mobx';
import { v4 as uuid4 } from 'uuid';
import { FileMetadata } from '../types';
import { RoomService, type FileRequest } from '../services/RoomService';
import { expectNever } from '../utils/expect';

type InitialStatus = { state: 'incoming' } | { state: 'outgoing', file: File };

type FileStatus = InitialStatus |
  { state: 'sending', content: ArrayBuffer, progress: number } |
  { state: 'receiving', progress: number } |
  { state: 'sent' } |
  { state: 'received', content: ArrayBuffer } |
  { state: 'rejected' } |
  { state: 'cancelled' } |
  { state: 'broken' };

export interface FileModel extends FileMetadata, Disposable {
  status: FileStatus;

  accept(): void;

  reject(): void;

  cancel(): void;

  break(): void;
}

export function createFileFromFile(roomService: RoomService, peerId: string, file: File): FileModel {
  return FileModelImpl.fromFile(roomService, peerId, file);
}

export function createFileFromMetadata(roomService: RoomService, peerId: string, metadata: FileMetadata): FileModel {
  return FileModelImpl.fromMetadata(roomService, peerId, metadata);
}

class FileModelImpl implements FileModel {
  #disposals: VoidFunction[] = [];

  get id() {
    return this.metadata.id;
  }

  get name() {
    return this.metadata.name;
  }

  get mimeType() {
    return this.metadata.mimeType;
  }

  get size() {
    return this.metadata.size;
  }

  public status: FileStatus;

  private constructor(private readonly roomService: RoomService, private readonly peerId: string, private readonly metadata: FileMetadata, initialStatus: InitialStatus) {
    this.status = initialStatus;

    switch (initialStatus.state) {
      case 'incoming':
        this.#disposals.push(
          roomService.onFileRequestReceived(({ type: requestType, ...metadata }) => {
            if (metadata.id !== this.metadata.id) return;

            switch (requestType) {
              case 'send':
              case 'accept':
              case 'reject':
                console.error(`Unexpected request: ${requestType}`, metadata);
                break;

              case 'cancel':
                this.status = { state: 'cancelled' };
                break;

              default:
                expectNever(requestType)
            }
          }, peerId),
        )
        break;

      case 'outgoing':
        this.#disposals.push(
          roomService.onFileRequestReceived(({ type: requestType, ...metadata }) => {
            if (metadata.id !== this.metadata.id) return;

            switch (requestType) {
              case 'send':
                console.error('Unexpected request: send', metadata);
                break;

              case 'accept':
                readFile(initialStatus.file).then(
                  buffer => {
                    if (this.status.state !== 'outgoing') return;

                    this.status = { state: 'sending', content: buffer, progress: 0 };

                    roomService.sendFile(buffer, metadata, peerId, progress => {
                      if (this.status.state === 'sending') this.status.progress = Math.round(progress * 100);
                    }).then(() => {
                      if (this.status.state === 'sending') this.status = { state: 'sent' };
                    });
                  },
                  () => {
                    this.status = { state: 'broken' }
                  }
                );
                break;

              case 'reject':
                if (this.status.state === 'outgoing') {
                  this.status = { state: 'rejected' };
                }
                break;

              case 'cancel':
                this.status = { state: 'cancelled' };
                break;

              default:
                expectNever(requestType);
            }
          }, peerId)
        );
        break;

      default:
        expectNever(initialStatus);
    }

    makeAutoObservable(this);
  }

  accept() {
    if (this.status.state !== 'incoming') return;

    this.status = { state: 'receiving', progress: 0 };
    this.sendRequest('accept');

    this.#disposals.push(
      this.roomService.onFileProgress(progress => {
        if (this.status.state === 'receiving') this.status.progress = Math.round(progress * 100);
      }, this.peerId, this.metadata.id),
      this.roomService.onFileReceived(content => {
        if (this.status.state === 'receiving') this.status = { state: 'received', content }
      }, this.peerId, this.metadata.id)
    );
  }

  reject() {
    if (this.status.state !== 'incoming') return;

    this.status = { state: 'rejected' };
    this.sendRequest('reject');
  }

  cancel() {
    switch (this.status.state) {
      case 'incoming':
        this.reject();
        break;

      case 'outgoing':
      case 'sending':
      case 'receiving':
        this.status = { state: 'cancelled' };
        this.sendRequest('cancel');
        break;

      case 'sent':
      case 'received':
      case 'rejected':
      case 'cancelled':
      case 'broken':
        break;

      default:
        return expectNever(this.status);
    }
  }

  break() {
    switch (this.status.state) {
      case 'outgoing':
      case 'incoming':
      case 'sending':
      case 'receiving':
        this.status = { state: 'broken' };
        break;

      case 'sent':
      case 'received':
      case 'rejected':
      case 'cancelled':
      case 'broken':
        break;

      default:
        return expectNever(this.status);
    }
  }

  private sendRequest(type: FileRequest['type']) {
    this.roomService.sendFileRequest({ type, ...this.metadata }, this.peerId);
  }

  public static fromFile(roomService: RoomService, peerId: string, file: File): FileModel {
    const metadata: FileMetadata = {
      id: uuid4(),
      name: file.name,
      mimeType: file.type,
      size: file.size
    };

    const model = new FileModelImpl(roomService, peerId, metadata, { state: 'outgoing', file });

    model.sendRequest('send');

    return model;
  }

  public static fromMetadata(roomService: RoomService, peerId: string, metadata: FileMetadata): FileModel {
    return new FileModelImpl(roomService, peerId, metadata, { state: 'incoming' });
  }

  dispose() {
    this.cancel();

    this.#disposals.forEach(dispose => dispose());
  }
}

export function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
      if (fileReader.result instanceof ArrayBuffer) {
        resolve(fileReader.result);
      }
    });

    fileReader.addEventListener('error', reject);

    fileReader.readAsArrayBuffer(file);
  });
}
