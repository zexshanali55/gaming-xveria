import next from "eslint-config-next";

/** eslint-config-next ships a flat config array, so it spreads in directly. */
const eslintConfig = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "src/generated/**", "public/**"],
  },
];

export default eslintConfig;
