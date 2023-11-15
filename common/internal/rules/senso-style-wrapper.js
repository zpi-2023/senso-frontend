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
      CallExpression({ callee }) {
        if (
          callee.type === "MemberExpression" &&
          callee.object.name === "StyleSheet" &&
          callee.property.name === "create"
        ) {
          context.report({
            node: callee,
            message:
              "Use `sty.create` or `sty.themedHook` from `@/common/styles` instead.",
          });
        }
      },
    };
  },
};
