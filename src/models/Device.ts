export interface DeviceModel {
  readonly peerId: string;

  deviceId: string;

  isOnline?: boolean;

  hasUpdates?: boolean;
}