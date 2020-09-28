import * as logger from 'electron-log';
import loggerService from './loggerService';

describe('logger tests', () => {
  it('logger tests', () => {
    logger.transports.file.level = 'debug';
    loggerService.debug('data');
    expect(logger.debug).toBeCalledWith('data');
  });
});
