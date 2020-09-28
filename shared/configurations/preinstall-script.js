/**
 * Do NOT allow using `npm` as package manager.
 */
if (process.env.npm_execpath.indexOf('yarn') === -1) {
  console.error('------------------------******------------------------------------');
  console.error('We are using Yarn for Dependency Management not Npm');
  console.error('  $ yarn install');
  console.error('------------------------******------------------------------------');
  process.exit(1);
}
