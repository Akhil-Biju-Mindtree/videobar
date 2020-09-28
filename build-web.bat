:: This batch file installs node modules dependecies, builds the web app assets.
call yarn install
call yarn set-version
call yarn build:web-prod:server
