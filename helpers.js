const EOL = require("os").EOL;

module.exports = {
  replaceCharsNotSupportedByBamboo: (s) => s.replace(/\./g, "_"),

  formatErrorMessages: (errorMessages) => {
    const header =
      errorMessages.length === 1
        ? "1 failure:"
        : `${errorMessages.length} failures:`;

    return errorMessages.reduce(
      (result, message) => result + EOL + `* ${message}`,
      header
    );
  },

  replaceVariables: (template, variables) => {
    return template
      .split(/\{|\}/)
      .filter((segment) => !!segment)
      .map((segment) => {
        return segment.split("|").reduce((result, maybeVariable) => {
          // Allow variables to fallback
          if (maybeVariable in variables) {
            return result ? result : variables[maybeVariable];
          }
          return maybeVariable;
        }, "");
      })
      .join("");
  },
};
