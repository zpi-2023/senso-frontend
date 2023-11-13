/**
 * @typedef {import("eslint").Rule.RuleModule} RuleModule
 * @typedef {import("eslint").Rule.RuleContext} RuleContext
 * @typedef {import("eslint").Rule.Node} Node
 */

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: { type: "suggestion" },
  create(context) {
    return {
      JSXMemberExpression(node) {
        if (node.object.name === "Stack" && node.property.name === "Screen") {
          context.report({
            node,
            message:
              "Illegal use of `Stack.Screen`.\nUse `Header` from `@/components` instead.",
          });
        }
      },
    };
  },
};
