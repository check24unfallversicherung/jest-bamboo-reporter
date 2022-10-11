var fs = require("fs");
var path = require("path");
var helpers = require("./helpers");

module.exports = function (results) {
  var output = {
    stats: {},
    failures: [],
    passes: [],
    skipped: [],
  };

  var filename = process.env.JEST_REPORT_FILE || "test-report.json";
  var suiteNameTemplate =
    process.env.JEST_BAMBOO_SUITE_NAME || "{firstAncestorTitle|filePath}";
  var nameSeparator = process.env.JEST_BAMBOO_NAME_SEPARATOR || " – ";

  output.stats.tests = results.numTotalTests;
  output.stats.passes = results.numPassedTests;
  output.stats.failures = results.numFailedTests;
  output.stats.duration = Date.now() - results.startTime;
  output.stats.start = new Date(results.startTime);
  output.stats.end = new Date();

  var existingTestTitles = Object.create(null);

  results.testResults.forEach(function (suiteResult) {
    var testFileName = path.basename(suiteResult.testFilePath);

    if (suiteResult.failureMessage && suiteResult.testResults.length === 0) {
      var suiteName = helpers.replaceCharsNotSupportedByBamboo(
        helpers.replaceVariables(suiteNameTemplate, {
          firstAncestorTitle: suiteResult.displayName,
          filePath: suiteResult.testFilePath,
          fileName: testFileName,
          fileNameWithoutExtension: path.parse(testFileName).name,
        })
      );
      output.failures.push({
        title: suiteName,
        fullTitle: suiteName,
        duration: suiteResult.perfStats.end - suiteResult.perfStats.start,
        errorCount: 1,
        error: suiteResult.failureMessage,
      });
    }

    suiteResult.testResults.forEach(function (testResult) {
      var suiteName = helpers.replaceCharsNotSupportedByBamboo(
        helpers.replaceVariables(suiteNameTemplate, {
          firstAncestorTitle: testResult.ancestorTitles[0],
          filePath: suiteResult.testFilePath,
          fileName: testFileName,
          fileNameWithoutExtension: path.parse(testFileName).name,
        })
      );
      var testTitle = helpers.replaceCharsNotSupportedByBamboo(
        testResult.ancestorTitles.concat([testResult.title]).join(nameSeparator)
      );

      if (testTitle in existingTestTitles) {
        var newTestTitle;
        var counter = 1;
        do {
          counter++;
          newTestTitle = testTitle + " (" + counter + ")";
        } while (newTestTitle in existingTestTitles);
        testTitle = newTestTitle;
      }

      existingTestTitles[testTitle] = true;

      var result = {
        title: testTitle,
        fullTitle: suiteName,
        duration: suiteResult.perfStats.end - suiteResult.perfStats.start,
        errorCount: testResult.failureMessages.length,
        error: testResult.failureMessages.length
          ? helpers.formatErrorMessages(testResult.failureMessages)
          : undefined,
      };

      switch (testResult.status) {
        case "passed":
          output.passes.push(result);
          break;
        case "failed":
          output.failures.push(result);
          break;
        case "pending":
          output.skipped.push(result);
          break;
        default:
          throw new Error(
            "Unexpected test result status: " + testResult.status
          );
      }
    });
  });

  fs.writeFileSync(filename, JSON.stringify(output, null, 2), "utf8");
  return results;
};
