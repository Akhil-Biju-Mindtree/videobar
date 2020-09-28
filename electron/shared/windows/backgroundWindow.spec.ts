const Application = require('spectron').Application;
const path = require('path');
const electronPath = path.resolve(__dirname, '../../../node_modules/.bin/electron');
const exec = require('child_process').exec;

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '../..')],
  startTimeout: 30000,
  waitTimeout: 30000,
});

describe('Application launch', function () {
  jest.setTimeout(30000);

  beforeEach(() => {
    return app.start();
  });

  afterEach(function () {
    if (app && app.isRunning()) {
      app.stop();
    }
  });

  test('shows an initial window', async () => {
    const count = await app.client.waitUntilWindowLoaded().getWindowCount();
    return expect(count).toEqual(1);
  });
});
