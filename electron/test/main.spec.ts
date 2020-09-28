import { app, ipcMain, ipcRenderer } from 'electron';
import errorWindow from '../shared/windows/errorWindow';
import mainWindow from '../shared/windows/mainWindow';
import { serviceMapper } from '../services/mapper.service';
import loggerService from '../../shared/logger/loggerService';
import { clear } from 'sisteransi';
import('../main');

describe('app ready test', () => {
  test('app ready test functionality', () => {
    expect(app.on).toHaveBeenCalledTimes(3);
  });

  test('app ready test functionality with args call', () => {
    expect(app.on).toHaveReturned();
  });
  test('app on with parameters', () => {
    expect((app.on as jest.Mock).mock.calls[0][0]).toBe('ready');
    expect((app.on as jest.Mock).mock.calls[1][0]).toBe('window-all-closed');
    expect((app.on as jest.Mock).mock.calls[2][0]).toBe('activate');
  });
  it('ipc main to be called', () => {
    expect(ipcMain.on).toHaveBeenCalledTimes(1);
  });
  it('ipc main to be called with parameter', () => {
    expect(jest.spyOn(ipcMain, 'on').mock.calls[0][0]).toBe('asynchronous-request');
  });
});
describe('ipcMain on', () => {
  it('subscribe', () => {
    const arg = {
      action: 'update',
      data: { camera: { 'camera.firstPreset': '1 0 0' } },
      id: 'f310caf0-ad25-11e9-b5fe-af66aadf7d46',
      password: '21',
    };

    jest.spyOn(ipcMain, 'on').mockImplementation((eventName, cb) => {
      if (eventName === 'asynchronous-request') {
        return cb(eventName, arg);
      }
    });
    const cb = (event, arg) => {
      expect(arg).toBe(arg);
    };
    ipcMain.on('asynchronus-request', cb);
    ipcRenderer.send('aynchronous-request', 'abcde');
  });
});
