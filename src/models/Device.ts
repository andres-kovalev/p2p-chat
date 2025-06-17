export interface DeviceModel {
  readonly peerId: string;

  name: string;

  isOnline?: boolean;

  hasUpdates?: boolean;
}