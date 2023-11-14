const path = require("path");

/**
 * @typedef {import("eslint").Rule.RuleModule} RuleModule
 */

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: { type: "suggestion", fixable: "code" },
  create(context) {
    const currentProjectDir = path.relative(
      context.cwd,
      path.dirname(context.physicalFilename),
    );

    return {
      ImportDeclaration({ source }) {
        if (source.value.startsWith("..")) {
          const fixedImport = path.join("@/", currentProjectDir, source.value);
          context.report({
            node: source,
            message:
              "Relative imports from parent directories are not allowed, import `{{ fixedImport }}` instead.",
            data: { fixedImport },
            fix(fixer) {
              return fixer.replaceText(source, `"${fixedImport}"`);
            },
          });
        }
      },
    };
  },
};
