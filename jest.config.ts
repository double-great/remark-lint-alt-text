import type { Config } from "jest";

const config: Config = {
  transformIgnorePatterns: ["!node_modules/"],
  moduleNameMapper: {
    "^../index.js$": "<rootDir>/index.ts",
    "^@double-great/alt-text/dist/clues/image-link.js$":
      "<rootDir>/node_modules/@double-great/alt-text/dist/clues/image-link.js",
  },
  prettierPath: require.resolve("prettier-2"),
};

export default config;
