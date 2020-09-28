:: This batch file installs node modules dependencies, rebuild electron app and creates a windows installer file.
call yarn install
echo "TEST FROM MINDTREE : Setting Version property to $version"
call yarn test:coverage
zip -r coverage.zip coverage
call yarn electron:rebuild
call yarn set-version
call yarn electron:windows
call yarn electron:windows-devtools