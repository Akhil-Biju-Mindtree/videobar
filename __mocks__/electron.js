module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    on: jest.fn()
  },

  remote: jest.fn(),
  dialog: { showErrorBox: jest.fn() },
  ipcMain: {
    on: jest.fn()
  },
  ipcRenderer: {
    on: jest.fn().mockImplementation((event, cb) => {
      console.log('event call' + event);
    }),
    send: jest.fn().mockImplementation((event, cb) => {
      console.log('event send call' + event);
    })
  },
  screen: {
    getPrimaryDisplay: jest.fn().mockImplementation(() => {
      return {
        workAreaSize: 1
      };
    })
  },
  Menu: {
    buildFromTemplate: jest.fn().mockImplementation(() => {
      return {
        popup: jest.fn()
      };
    }),
    setApplicationMenu: jest.fn()
  },
  BrowserWindow: jest.fn().mockImplementation(() => {
    return {
      getAllWindows: jest.fn(),
      on: jest.fn(),
      show: jest.fn(),
      focus: jest.fn(),
      destroy: jest.fn(),
      hide: jest.fn(),
      setSize: jest.fn(),
      loadURL: jest.fn(),
      webContents: {
        workAreaSize: {
          width: 10,
          height: 20
        },
        on: jest.fn(),
        send: jest.fn()
      },
      getBounds: jest.fn().mockImplementation(() => {
        return { x: 1, y: 2, height: 2, width: 2 };
      })
    };
  })
};
