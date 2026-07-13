import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**", "prisma/dist/**"],
  },
];

export default eslintConfig;