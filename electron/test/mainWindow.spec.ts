import mainWindow from '../shared/windows/mainWindow';
import * as path from 'path';
import * as url from 'url';
import { app, BrowserWindow, screen, Menu } from 'electron';
jest.mock('url');
jest.mock('path');
import deviceController from '../../server/controllers/device.controller';

describe('Error Window Test', () => {
  const brWindow = mainWindow();
  it('main window functionality', () => {    
    expect(typeof brWindow).toBe('object');
    expect(brWindow.on).toHaveBeenCalledTimes(1);
    expect(brWindow.on.length).toEqual(0);
  });
  it('main window functionality called with args', () => {
    
    (brWindow.on as jest.Mock)(() => {
      return null;
    });
    
  });

  it('main window on functionality called', () => {
    expect(jest.spyOn(brWindow, 'on').mock.calls[0][0]).toBe('closed');
  });
  it('main window webcontents functionality called', () => {
    expect((brWindow.webContents.on as jest.Mock).mock.calls[0][0]).toBe('did-finish-load');
  });
});
