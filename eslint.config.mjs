import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    ignorePatterns: ['dist/'], 
  },
  {
    languageOptions: { globals: globals.browser },
  },
];