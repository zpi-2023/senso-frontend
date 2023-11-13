/**
 * @typedef {import("eslint").Rule.RuleModule} RuleModule
 * @typedef {import("eslint").Rule.RuleContext} RuleContext
 * @typedef {import("eslint").Rule.Node} Node
 */

/**
 * @param {Node} tree
 * @returns {Node[]}
 */
const findBannedNodes = (tree) => {
  if (["Literal", "TemplateLiteral", "BinaryExpression"].includes(tree.type)) {
    return [tree];
  }

  if (tree.type === "ConditionalExpression") {
    return [
      ...findBannedNodes(tree.consequent),
      ...findBannedNodes(tree.alternate),
    ];
  }

  if (tree.type === "JSXExpressionContainer") {
    return findBannedNodes(tree.expression);
  }

  const pathname = tree.properties?.find(({ key }) => key.name === "pathname");
  if (tree.type === "ObjectExpression" && pathname) {
    return findBannedNodes(pathname.value);
  }

  return [];
};

/**
 * @param {RuleContext} context
 * @param {Node} tree
 * @returns {void}
 */
const checkRoute = (context, tree) => {
  for (const node of findBannedNodes(tree)) {
    context.report({
      node,
      message:
        "You should use the `AppRoutes` enum for all routes.\nThe enum is accessible via `@/common/constants`.",
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
