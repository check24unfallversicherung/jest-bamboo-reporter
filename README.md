# jest-bamboo-reporter

A reporter for jest which produces a report compatible with Atlassian Bamboo Mocha Test Parser.

[![npm](https://img.shields.io/npm/v/jest-bamboo-reporter.svg?style=flat-square)](https://www.npmjs.com/package/jest-bamboo-reporter)
[![npm downloads](https://img.shields.io/npm/dt/jest-bamboo-reporter.svg?style=flat-square)](https://www.npmjs.com/package/jest-bamboo-reporter)

Forked from [jest-bamboo-formatter](https://github.com/adalbertoteixeira/jest-bamboo-formatter), with major changes in order to work around Bamboo's naming restrictions:

* Bamboo skips tests with identical names, making some tests magically "disappear". This issue is fixed by appending "(2)", "(3)", etc. to the end of tests with otherwise identical names
* The separation into a "class name" (as expected by Bamboo) and a "test name" is based on the suite name hierarchy (with file name as fallback)
* Bamboo completely messes up test (suite) names that contain a period ("."), so this fork replaces those with underscores ("_")

## Installation

~~~sh
npm install --save-dev jest-bamboo-reporter
~~~

## Usage

In the jest config file add the path to the module. For example:

~~~json
{
    "testResultsProcessor": "jest-bamboo-reporter"
}
~~~

then run jest (or a `npm run` command) with the path to the config file

~~~sh
jest --config=./config/jest.config.json
~~~

## Configuration

The name of test suite and separator can be customized by setting the environment variables

~~~sh
JEST_BAMBOO_SUITE_NAME="{fileNameWithoutExtension}" JEST_BAMBOO_NAME_SEPARATOR=" >> " jest
~~~

`JEST_BAMBOO_SUITE_NAME` supports following variables
- firstAncestorTitle: The name of the outermost "describe" group
- filePath: Full path of the test
- fileName: File name of the test
- fileNameWithoutExtension: File name of the test without extension

Also, variable supports fallback. For example:
`{firstAncestorTitle|filename}` means use file name of the test if it doesn't have a group name.

## Output

By default, the reporter writes to `test-report.json`. The file name can be changed by setting the `JEST_REPORT_FILE` environment variable.

~~~sh
JEST_REPORT_FILE="./jest-report.json" jest
~~~

## License

[MIT](https://github.com/CHECK24/jest-bamboo-reporter/blob/master/LICENSE)
