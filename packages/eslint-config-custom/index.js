module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "eslint-config-turbo",
    "eslint-config-prettier" 
  ],
  settings: {
    react: {
      version: "detect"
    }
  }
}