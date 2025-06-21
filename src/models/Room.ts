import { inject, scoped, Lifecycle, Disposable } from 'tsyringe';
import { makeAutoObservable } from "mobx";
import type { Credentials } from "../types";
import { createDevice, type DeviceModel } from "./Device";
import { RoomService } from "../services/RoomService";
import { StorageService } from '../services/StorageService';
import { assertNumber } from '../utils/assert';

export interface RoomModel extends Disposable {
  readonly roomName: string;

  name: string;

  readonly devices: DeviceModel[];

  current: DeviceModel | undefined;

  panelSize: number | undefined;
}

@scoped(Lifecycle.ContainerScoped)
export class RoomModelImpl implements RoomModel {
  public readonly roomName: string;

  public name: string;

  public devices: DeviceModel[] = [];

  private _current: DeviceModel | undefined = undefined;

  public get current() {
    return this._current;
  }

  public set current(device: DeviceModel | undefined) {
    if (this._current === device) return;

    this._current?.unselect();
    device?.select();

    this._current = device;
  }

  #id = 0;

  #panelSize: number | undefined;

  constructor(
    @inject('Credentials') credentials: Credentials,
    private readonly roomService: RoomService,
    private readonly storageService: StorageService,
  ) {
    this.#panelSize = storageService.read<number>('panelSize', assertNumber);

    this.roomName = credentials.login;
    this.name = credentials.deviceName;

    this.roomService.onJoin(peerId => {
      this.roomService.sendDeviceName(this.name, peerId);
      this.devices.push(createDevice(this.roomService, peerId, `[Device ${this.#id++}]`));
    });

    this.roomService.onDeviceNameReceived((deviceName, peerId) => {
      const existing = this.devices
        .filter(device => device.peerId !== peerId)
        .map(({ name }) => name);

      let peerDeviceName = deviceName;
      let index = 0;
      while (existing.includes(peerDeviceName)) peerDeviceName = `${deviceName} (${++index})`;

      if (peerDeviceName !== deviceName) {
        this.roomService.sendAdvice({ type: 'rename', name: peerDeviceName }, peerId);
      }
    });

    this.roomService.onAdviceReceived((advice) => {
      if (advice.type === 'rename') {
        this.name = advice.name;
        this.roomService.sendDeviceName(advice.name);
      }
    });

    this.roomService.onLeave((peerId) => {
      const device = this.devices.find(device => device.peerId === peerId);
      if (!device) {
        return;
      }

      device.isOnline = false;
    });

    makeAutoObservable(this);
  }

  dispose(): void {
    this.roomService.dispose();

    this.devices.forEach(device => device.dispose());
  }

  get panelSize(): number | undefined {
    return this.#panelSize;
  }

  set panelSize(value: number | undefined) {
    if (!value) return;

    this.storageService.write('panelSize', value);
    this.#panelSize = value;
  }
}
