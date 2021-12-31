module.exports = {
  parser: "@babel/eslint-parser",
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
      version: "16.0"
    }
  },
  plugins: [
    "react"
  ],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended"
  ]
}