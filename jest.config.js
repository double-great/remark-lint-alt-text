export default {
  transformIgnorePatterns: ["!node_modules/"],
  moduleNameMapper: {
    "^../index.js$": "<rootDir>/index.ts",
    "^@double-great/alt-text/dist/clues/image-link.js$":
      "<rootDir>/node_modules/@double-great/alt-text/dist/clues/image-link.js",
  },
  prettierPath: "<rootDir>/node_modules/prettier-2/index.js",
};
