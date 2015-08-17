# docker-iojs
A docker container used for running iojs applications with a specific project layout we've adopted at Power Tower for some quick-and-dirty development.

### Requirements
 * A `package.json` file in the root of `/data/`.
    * It must also have the `main` property defined.

### Environment Variables of Note

 * `NODE__PROCESS_TITLE` will set `process.title`
 * `NPM__SILENT` will turn off the logging of the output from `npm install` if its value is set to `true` (case-insensitive)

### JS Transpilation via Babel

 * `.babelrc` required, even if it's just `{}`, to trigger `babel/register`.
    - A string as the property of `only` and `ignore` options will be evaluated as regular expressions.
        - If RegExp compilation fails, the value will be left the way it was.
