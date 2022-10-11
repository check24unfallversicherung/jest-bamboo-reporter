const EOL = require("os").EOL;

module.exports = {
  replaceCharsNotSupportedByBamboo: (s) => s.replace(/\./g, "_"),

  formatErrorMessages: (errorMessages) => {
    const lines = [];

    if (errorMessages.length === 1) {
      lines.push("1 failure:");
    } else {
      lines.push(errorMessages.length + " failures:");
    }

    errorMessages.forEach((message) => {
      lines.push("* " + message);
    });

    return lines.join(EOL);
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
