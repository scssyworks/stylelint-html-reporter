# stylelint-html-reporter
HTML reporter for stylelint

# Installation
```
npm install --save-dev gulp-stylelint stylelint-html-reporter
```

# Usage

## Standalone
Stylelint HTML reporter can be used as a standalone formatter. You can write a custom formatter as follows:

<b>myCustomFormatter.js</b>

```js
const stylelintReporter = require('stylelint-html-reporter');
const reporter = stylelintReporter(/* Pass options object here */);

/**
 * @type {import('stylelint').Formatter} 
 */
module.exports = reporter;
```

You can use it as a custom formatter:

```sh
stylelint "*.css" --custom-formatter ./myCustomFormatter.js
```

## With Gulp
```js
const gulp = require('gulp');
 
gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');
  const stylelintReporter = require('stylelint-html-reporter');
 
  return gulp
    .src('src/**/*.css')
    .pipe(gulpStylelint({
      reporters: [
        {
            formatter: stylelintReporter(),
            console: true
        }
      ]
    }));
});
```

# Options

<b>filename</b> - (Optional) - 
Name of file to be generated

```js
const gulp = require('gulp');
 
gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');
  const stylelintReporter = require('stylelint-html-reporter');
 
  return gulp
    .src('src/**/*.css')
    .pipe(gulpStylelint({
      reporters: [
        {
            formatter: stylelintReporter({
                filename: '/dist/reports/stylelint-report.html'
            }),
            console: true
        }
      ]
    }));
});
```