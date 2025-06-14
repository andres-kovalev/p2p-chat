import { Peers } from "./components/Peers";
import { DeviceModel } from "./models/Device";

const devices: DeviceModel[] = [
  {
    peerId: '0',
    deviceId: 'VKMac',
    isOnline: true,
    hasUpdates: true
  },
  {
    peerId: '1',
    deviceId: 'iPhone',
  },
  {
    peerId: '2',
    deviceId: 'Android',
  },
]

export function App() {
  return (
    <Peers
      roomName="MyName"
      devices={devices}
      onMenuClick={() => {}}
      onRenameClick={() => {}}
      onSelect={() => {}}
    />
  );
}
