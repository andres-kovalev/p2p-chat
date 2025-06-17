export type FileMetadata = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
}

type InitialStatus = { state: 'incoming' } | { state: 'outgoing', file: File };

type FileStatus = InitialStatus |
  { state: 'sending', content: ArrayBuffer, progress: number } |
  { state: 'receiving', progress: number } |
  { state: 'sent' } |
  { state: 'received', content: ArrayBuffer } |
  { state: 'rejected' } |
  { state: 'cancelled' } |
  { state: 'broken' };

export interface FileModel extends FileMetadata {
  status: FileStatus;

  accept(): void;

  reject(): void;

  cancel(): void;
}