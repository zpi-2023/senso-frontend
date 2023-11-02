/**
 * @typedef {import("eslint").Rule.RuleModule} RuleModule
 * @typedef {import("eslint").Rule.RuleContext} RuleContext
 * @typedef {import("eslint").Rule.Node} Node
 */

/**
 * @param {Node} node
 * @returns {boolean}
 */
const isRouteBanned = (node) => {
  if (["Literal", "TemplateLiteral", "BinaryExpression"].includes(node.type)) {
    return true;
  }

  if (node.type === "JSXExpressionContainer") {
    return isRouteBanned(node.expression);
  }

  return false;
};

/**
 * @param {RuleContext} context
 * @param {Node} node
 * @returns {void}
 */
const checkRoute = (context, node) => {
  if (isRouteBanned(node)) {
    context.report({
      node,
      message: "You should use the `AppRoutes` enum for all routes.",
    });
  }
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: { type: "suggestion" },
  create(context) {
    return {
      JSXOpeningElement({ name, attributes }) {
        if (name.name === "Link") {
          for (const attribute of attributes) {
            if (attribute.name.name === "href") {
              checkRoute(context, attribute.value);
            }
          }
        }
      },
      CallExpression({ callee, arguments: args }) {
        if (
          callee.type === "MemberExpression" &&
          callee.object.name === "router" &&
          ["push", "replace"].includes(callee.property.name) &&
          args.length === 1
        ) {
          checkRoute(context, args[0]);
        }
      },
    };
  },
};
