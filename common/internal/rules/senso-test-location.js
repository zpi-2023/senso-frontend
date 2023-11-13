/**
 * @typedef {import("eslint").Rule.RuleModule} RuleModule
 * @typedef {import("eslint").Rule.Node} Node
 */

/**
 * @param {Node} node
 * @returns {boolean}
 */
const isBanned = (node) => {
  if (node.type === "Identifier" && ["it", "describe"].includes(node.name)) {
    return true;
  }

  if (node.type === "MemberExpression") {
    return isBanned(node.object);
  }

  return false;
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: { type: "problem" },
  create(context) {
    return {
      CallExpression({ callee }) {
        if (/\/tests\/.*?\.test\.[jt]sx?$/.test(context.physicalFilename)) {
          return; // allowed in test files
        }

        if (isBanned(callee)) {
          context.report({
            node: callee,
            message: "Jest can only be used in test files.",
          });
        }
      },
    };
  },
};
