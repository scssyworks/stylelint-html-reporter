const getFileName = require('./getFileName.js');

module.exports = function (results) {
    if (Array.isArray(results)) {
        let baseHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Style Lint Report</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
            body {
                font-family: "Tahoma", Geneva, sans-serif;
                color: #555;
                width: 1600px;
                padding: 0 20px;
                margin: auto;
            }
            h1,h2 {
                padding: 20px 0;
                font-size: 24px;
                text-transform: uppercase;
            }
            ul {
                list-style-type: none;
            }
            .summary {
                display: table;
                border-collapse: collapse;
            }
            .summary li {
                display: table-row;
            }
            .summary li span {
                display: table-cell;
            }
            .summary li span,
            .error-summary span,
            .error-list > div > span {
                padding: 10px 20px;
            }
            .error-list span {
                display: inline-block;
                color: #a31a1a;
            }
            .error-list .rule,
            .error-list .line,
            .error-list .message {
                box-sizing: border-box;
                float: left;
            }
            .error-list .rule {
                color: #999;
                width: 30%;
            }
            .error-list .line {
                width: 10%;
            }
            .error-list .line span,
            .error-list .message {
                font-weight: bold;
            }
            .error-list .message {
                width: 60%;
            }
            .error-list .message {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .summary-title,
            .error-summary {
                text-transform: uppercase;
                color: #000;
            }
            .summary-title {
                background-color: #bbd3e8;
            }
            .error-summary > span:first-child {
                width: 60%;
            }
            .error-summary > span {
                box-sizing: border-box;
                float: left;
                width: 20%;
                cursor: pointer;
            }
            .error-summary.errored > span {
                background-color: #e8b4b4;
            }
            .error-summary.valid > span {
                background-color: #8ac181;
            }
            .summary-title > span,
            .error-summary > span {
                border: 1px solid #000;
            }
            .clearfix::before,
            .clearfix::after {
                content: "";
                display: table;
                clear: both;
            }
            .details {
                padding: 0;
            }
            .error-summary span+span {
                border-left: 0;
            }
            .error-summary.errored .error-count {
                background-color: #a31a1a;
                color: #fff;
            }
            .error-summary .filename {
                text-transform: none;
            }
            .error-summary .error-count span,
            .error-summary .warning-count span {
                font-weight: bold;
                padding: 0;
            }
            .error-list {
                margin-bottom: 20px;
            }
            .hidden {
                display: none !important;
            }
            .no-error {
                display: block;
                padding: 20px;
            }
            </style>
        </head>

        <body>
            {{summaryTable}}
            {{detailedList}}
            <script>
            document.body.onclick = function (event) {
                var currentTarget = event.target;
                var classList = currentTarget.classList;
                if (classList.contains('filename') || classList.contains('error-count') || classList.contains('warning-count')) {
                    currentTarget.parentNode.nextElementSibling.classList.toggle('hidden');
                }
            };
            </script>
        </body>

        </html>`;
        const detailedList = [];
        const summary = results.reduce((finalObject, next) => {
            let errorSummary = {},
                errors = {
                    error: 0,
                    warning: 0
                };
            const filename = next.source.match(/\/([^\/]+(.scss|.sass)$)/) || [];
            detailedList.push({
                filename: filename[1] || '',
                filesource: next.source,
                errors,
                warnings: next.warnings,
                errored: next.errored
            });
            if (Array.isArray(next.warnings)) {
                errorSummary = next.warnings.reduce((out, next) => {
                    if (!out[next.rule]) {
                        out[next.rule] = {
                            error: 0,
                            warning: 0
                        }
                    }
                    out[next.rule][next.severity] += 1;
                    errors[next.severity] += 1;
                    return out;
                }, {});
            }
            Object.keys(errorSummary).forEach(rule => {
                if (!finalObject[rule]) {
                    finalObject[rule] = {
                        error: 0,
                        warning: 0
                    };
                }
                finalObject[rule].error += errorSummary[rule].error;
                finalObject[rule].warning += errorSummary[rule].warning;
            });
            return finalObject;
        }, {});
        // Parse results into summary table
        const summaryTable = `
        <h1>Stylelint summary</h1>
        <ul class="summary">
        <li class="summary-title"><span>Rule</span><span>Errors</span><span>Warnings</span></li>
        ${Object.keys(summary).map(key => `<li class="summary-content"><span>${key}</span><span>${summary[key].error}</span><span>${summary[key].warning}</span></li>`).join('\n\t')}
        </ul>
        `;
        // Sort detailedList
        detailedList.sort(function (listItem) {
            if (listItem.errored) {
                return -1;
            }
            return 1;
        });
        // Parse detailed list
        const detailsTable = `
        <h2>Error Details</h2>
        <ul class="details">
        ${detailedList.map(errorObj => `
        <li>
        <div class="error-summary ${errorObj.errored ? 'errored' : 'valid'} clearfix"><span class="filename" title="${errorObj.filesource}">${errorObj.filename || getFileName(errorObj.filesource)}</span><span class="error-count">Errors: <span>${errorObj.errors.error}</span></span><span class="warning-count">Warnings: <span>${errorObj.errors.warning}</span></span></div>
        ${errorObj.warnings.length ? `<div class="error-list clearfix hidden">
            ${errorObj.warnings.map(warning => `
            <div class="${warning.severity} clearfix">
                <span class="rule">[${warning.rule}]</span>
                <span class="line">ln: <span>${warning.line}</span> col: <span>${warning.column}</span></span>
                <span class="message" title="${warning.text.replace(/[\"]/g, '')}">${warning.text}</span>
            </div>
            `).join('\n\t')}
        </div>` : '<span class="no-error hidden">This file has no errors</span>'}
        </li>
        `).join('\n\t')}
        </ul>
        `;
        return baseHtml.replace('{{summaryTable}}', summaryTable).replace('{{detailedList}}', detailsTable);
    }
};
