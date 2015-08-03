# docker-iojs
A docker container used for running iojs applications with a specific project layout we've adopted at Power Tower for some quick-and-dirty development.

### Environment Variables of Note

 * `NODE__PROCESS_TITLE` will set `process.title`
 * `NPM__SILENT` will turn off the logging of the output from `npm install` if its value is set to `true` (case-insensitive)
