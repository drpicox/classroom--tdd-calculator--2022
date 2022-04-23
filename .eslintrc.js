// DO NOT MODIFY THIS FILE
module.exports = {
  extends: ["react-app"],
  ignorePatterns: ["node_modules", "coverage", "husky", "helpers"],
  rules: {
    complexity: ["error", { max: 6 }],
    "max-depth": ["error", { max: 2 }],
    "max-params": ["error", { max: 3 }],
    "max-lines-per-function": ["error", { max: 20, IIFEs: true }],
    "max-nested-callbacks": ["error", { max: 1 }],
    "no-console": ["error"],
    "no-eval": "error",
    "no-implied-eval": "error",
  },
};
