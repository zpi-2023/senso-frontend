/**
 * @typedef {import("eslint").Rule.RuleModule} RuleModule
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
              "Illegal use of `Stack.Screen`, use `Header` from `@/components` instead.",
          });
        }
      },
    };
  },
};
