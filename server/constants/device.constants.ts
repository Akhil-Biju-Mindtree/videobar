const DEVICE_CODES = {
  vid: [1447],
  pid: [41491],
  serialNumber: '0001',
  usagePage: process.platform === 'darwin' ? 12 : 0xff00,
  storagepid: 41491,
  storagevid: 1447,
  deviceNameWindows: 'USB Mass Storage Device',
  deviceNameMac: 'Bose Videobar VB1 Mass Storage Gadget',
};
const DEVICE_EVENTS = {
  add: 'add',
  remove: 'remove',
  attach: 'attach',
  detach: 'detach',
  storageattach: 'storage-attach',
  storagedetach: 'storage-detach',
};
enum RESPONSE_POSITION {
  zero = 4,
  first = 254,
  last = 255,
}

export { DEVICE_CODES, DEVICE_EVENTS, RESPONSE_POSITION };
