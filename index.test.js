const fs = require("fs");
const jestBambooReporter = require("./index");

const processReport = (filename) =>
  jestBambooReporter(
    JSON.parse(fs.readFileSync(__dirname + "/test-files/" + filename, "utf8"))
  );

describe("jest-bamboo-reporter", () => {
  beforeEach(() => {
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("2016-08-18T12:00:55.242Z").getTime());
  });

  afterEach(() => {
    fs.unlinkSync("./test-report.json");
  });

  it("should create the expected result", () => {
    processReport("jest-output.json");
    const actualResult = JSON.parse(
      fs.readFileSync("./test-report.json", "utf8")
    );
    const expectedResult = JSON.parse(
      fs.readFileSync(__dirname + "/test-files/expected-result.json", "utf8")
    );

    expect(actualResult).toEqual(expectedResult);
  });

  it("should use suite name template", () => {
    try {
      process.env.JEST_BAMBOO_SUITE_NAME = "{fileNameWithoutExtension}";
      processReport("jest-output.json");
      const actualResult = JSON.parse(
        fs.readFileSync("./test-report.json", "utf8")
      );
      const expectedResult = JSON.parse(
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

  it("should report test case failures", () => {
    processReport("case-failure.json");
    const actualResult = JSON.parse(
      fs.readFileSync("./test-report.json", "utf8")
    );
    expect(actualResult.failures.length).toBe(2);
  });

  it("should report test suite failures", () => {
    processReport("suite-failure.json");
    const actualResult = JSON.parse(
      fs.readFileSync("./test-report.json", "utf8")
    );
    expect(actualResult.failures.length).toBe(1);
  });
});
