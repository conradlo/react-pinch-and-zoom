module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  env: {
    browser: true,
    node: true
  },
  settings: {
    react: {
      pragma: "React",
      version: "16.0"
    }
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks"
  ],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // "react/prop-types": "off"
  },
}