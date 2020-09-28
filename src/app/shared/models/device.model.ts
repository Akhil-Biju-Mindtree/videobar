export class DeviceModel {
  action: string;
  password?: string;
  id: string;
  data: {};

  constructor(action: string, id: string, data: {}, password?: string) {
    this.action = action;
    this.password = password;
    this.id = id;
    this.data = data;
  }
}

export class DeviceModelSubscribeAll {
  action: string;
  password?: string;
  id: string;

  constructor(action: string, id: string, password?: string) {
    this.action = action;
    this.password = password;
    this.id = id;
  }
}
