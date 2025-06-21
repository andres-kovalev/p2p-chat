export interface Credentials {
  login: string;
  hash: string;
  deviceName: string;
}

export type FileMetadata = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
}
