const formatter = require('@commitlint/format');
const chalk = require('chalk');

module.exports = (report, options) => {
  const isError = report.errorCount > 0;
  let result = formatter.default(report, options);
  if (isError) {
    result += chalk.yellow("\n\nPlease use command 'npm run commit' to commit changes\n\n");
  }
  return result;
};
