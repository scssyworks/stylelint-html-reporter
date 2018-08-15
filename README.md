# stylelint-html-reporter
HTML reporter for stylelint

# Installation
```
npm install --save-dev gulp-stylelint stylelint-html-reporter
```

# How to use it with gulp-stylelint?
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

<b>filename</b>(Optional)
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