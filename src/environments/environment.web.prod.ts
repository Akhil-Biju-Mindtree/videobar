// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `index.ts`, but if you do
// `ng build --env=prod` then `index.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const AppConfig = {
  production: true,
  environment: 'PROD',
  isDesktopApp: false,
  webSocketPort: '8000',
  logLevel: 'debug',
  firmwareUpdateServer: `${window.location.protocol}//${window.location.hostname}/fileserver`,
  logFileName: 'bose-raphael',
  enableConsoleLog: true,
  logFileSize: 1048333,
  // logFileSize: 1048576,
  logsFileCount: 5,
  enableStorageLog: true,
};
