var fs = require("fs");
var jestBambooReporter = require("./index");

function processReport(filename) {
  return jestBambooReporter(
    JSON.parse(fs.readFileSync(__dirname + "/test-files/" + filename, "utf8"))
  );
}

describe("jest-bamboo-reporter", function () {
  beforeEach(function () {
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("2016-08-18T12:00:55.242Z").getTime());
  });

  afterEach(function () {
    fs.unlinkSync("./test-report.json");
  });

  it("should create the expected result", function () {
    processReport("jest-output.json");
    var actualResult = JSON.parse(
      fs.readFileSync("./test-report.json", "utf8")
    );
    var expectedResult = JSON.parse(
      fs.readFileSync(__dirname + "/test-files/expected-result.json", "utf8")
    );

    expect(actualResult).toEqual(expectedResult);
  });

  it("should use suite name template", function () {
    try {
      process.env.JEST_BAMBOO_SUITE_NAME = "{fileNameWithoutExtension}";
      processReport("jest-output.json");
      var actualResult = JSON.parse(
        fs.readFileSync("./test-report.json", "utf8")
      );
      var expectedResult = JSON.parse(
        fs.readFileSync(
          __dirname + "/test-files/expected-result-with-filename.json",
          "utf8"
        )
      );

      expect(actualResult).toEqual(expectedResult);
    } finally {
      delete process.env.JEST_BAMBOO_SUITE_NAME;
    }
  });

  it("should report test case failures", function () {
    processReport("case-failure.json");
    var actualResult = JSON.parse(
      fs.readFileSync("./test-report.json", "utf8")
    );
    expect(actualResult.failures.length).toBe(2);
  });

  it("should report test suite failures", function () {
    processReport("suite-failure.json");
    var actualResult = JSON.parse(
      fs.readFileSync("./test-report.json", "utf8")
    );
    expect(actualResult.failures.length).toBe(1);
  });
});
