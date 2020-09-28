module.exports = {
  transports: {
    file: {
      level: jest.fn(),
      fileName: jest.fn(),
      maxSize: jest.fn(),
      archiveLog: jest.fn()
    },
    console: {
      level: jest.fn()
    }
  },
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  trace: jest.fn(),
  warn: jest.fn()
};
