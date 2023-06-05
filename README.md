# Stylelint HTML Reporter

Generates HTML report for stylelint

# Installation

```
npm i -D stylelint stylelint-html-reporter
```

# How to use?

Stylelint HTML reporter can be used as a standalone formatter. You can write a
custom formatter as follows:

<b>myCustomFormatter.js</b>

```js
const stylelintReporter = require("stylelint-html-reporter");

module.exports = stylelintReporter(/* Pass options object here */);
```

You can use it as a custom formatter:

```sh
stylelint "*.css" --custom-formatter ./myCustomFormatter.js
```

# Options

**filename** - (Optional) - Name of file to be generated

```js
const stylelintReporter = require("stylelint-html-reporter");

module.exports = stylelintReporter({
  filename: "/dist/reports/stylelint-report.html",
});
```
