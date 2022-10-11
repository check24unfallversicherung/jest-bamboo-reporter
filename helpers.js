const EOL = require("os").EOL;

module.exports = {
  replaceCharsNotSupportedByBamboo: function replaceCharsNotSupportedByBamboo(
    s
  ) {
    return s.replace(/\./g, "_");
  },

  formatErrorMessages: function formatErrorMessages(errorMessages) {
    const lines = [];

    if (errorMessages.length === 1) {
      lines.push("1 failure:");
    } else {
      lines.push(errorMessages.length + " failures:");
    }

    errorMessages.forEach(function (message) {
      lines.push("* " + message);
    });

    return lines.join(EOL);
  },

  replaceVariables: function replaceVariables(template, variables) {
    return template
      .split(/\{|\}/)
      .filter(function (segment) {
        return segment;
      })
      .map(function (segment) {
        return segment.split("|").reduce(function (result, maybeVariable) {
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
