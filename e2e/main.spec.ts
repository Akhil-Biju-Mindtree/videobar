import { SpectronClient } from 'spectron';

import commonSetup from './common-setup';

describe('Bose-Work-Configuration App', function () {
  commonSetup.apply(this);

  let browser: any;
  let client: SpectronClient;

  beforeEach(function () {
    client = this.app.client;
    browser = client as any;
  });
});
