import { DeviceModel } from './Device';

export interface RoomModel {
  readonly roomName: string;

  name: string;

  readonly devices: DeviceModel[];

  current: DeviceModel | undefined;
}
