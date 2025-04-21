module.exports = {
  root: true,
  extends: [],
  rules: {
    // Disable all rules
    "no-console": "off",
    "no-debugger": "off",
    "no-unused-vars": "off",
    "no-warning-comments": "off",
    // Add any other specific rules you want to disable
  },
  // Turn off all TypeScript-related warnings
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
  },
  reportUnusedDisableDirectives: false,
  ignorePatterns: ["node_modules/", "dist/", "build/"],
};
