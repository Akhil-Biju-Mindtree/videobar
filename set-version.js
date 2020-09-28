const fs = require('fs');
const exec = require('child_process').exec;
const packageJSON = require('./package.json');
exec('git rev-parse --short HEAD', (error, stdout, stderr) => {
  const hash = stdout.split('\n')[0].slice(0, 7);
  const appVersion = packageJSON.version + '_' + hash;
  if (error !== null) {
    console.log(`exec error: ${error}`);
  }
  if (stderr) {
    console.log(`exec stderr: ${stderr}`);
  }
  if (stdout) {
    fs.readFile('./src/app/core/constants/app.constant.ts', 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      const result = data.replace(
        /APP_VERSION: \'App Version: 1.10\',/g,
        "APP_VERSION: 'App Version: " + appVersion + "',",
      );

      fs.writeFile('./src/app/core/constants/app.constant.ts', result, 'utf8', (err) => {
        if (err) return console.log(err);
      });
    });

    fs.readFile('./electron-builder.json', 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      let replacedJSON = data
        .replace(
          'Bose-Work-Configuration-Win-${version}.${ext}',
          'Bose-Work-Configuration-Win-${version}-' + hash + '.${ext}',
        )
        .replace(
          'Bose-Work-Configuration-Mac-${version}.${ext}',
          'Bose-Work-Configuration-Mac-${version}-' + hash + '.${ext}',
        );

      fs.writeFile('./electron-builder.json', replacedJSON, 'utf8', (err) => {
        if (err) return console.log(err);
      });
    });

    // Set version for webUI
    fs.readFile('./package.json', 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      let replacedJSON = data.replace(
        'webUI.zip',
        'Bose-Work-Configuration-WebUI-' + appVersion.replace('_', '-') + '.zip',
      );
      fs.writeFile('./package.json', replacedJSON, 'utf8', (err) => {
        if (err) return console.log(err);
      });
    });
  }
});
