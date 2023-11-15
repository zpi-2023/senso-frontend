const path = require("path");

/**
 * @typedef {import("eslint").Rule.RuleModule} RuleModule
 */

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: { type: "suggestion" },
  create(context) {
    const currentProjectDir = path.relative(
      context.cwd,
      path.dirname(context.physicalFilename),
    );

    const insideApp = currentProjectDir.startsWith("app");

    return {
      ExportAllDeclaration(node) {
        context.report({
          node,
          message:
            "Barrel exports are not allowed, list all identifiers explicitly.",
        });
      },
      ExportNamedDeclaration(node) {
        if (insideApp) {
          context.report({
            node,
            message:
              "Named exports are not allowed in the `app` directory, use default exports instead.",
          });
        }
      },
      ExportDefaultDeclaration(node) {
        if (!insideApp) {
          context.report({
            node,
            message:
              "Default exports are not allowed outside of the `app` directory, use named exports instead.",
          });
        }
      },
    };
  },
};
