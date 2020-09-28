export class DeviceError extends Error {
  code: string;
  message: string;
  innerException?: any;
  stack: any;
}
