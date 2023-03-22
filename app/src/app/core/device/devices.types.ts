export interface IDevice {
  deviceId: string;
  data: { [key: string]: string };
  location: string;
  state: boolean;
}
