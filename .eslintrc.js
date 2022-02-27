module.exports = {
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  env: {
    browser: true,
  },
  rules: {
    indent: ["error", 2],
    semi: ["error", "always"],
    "no-unused-vars": 1,
    "no-multiple-empty-lines": 0,
  },
};
