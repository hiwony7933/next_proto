import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";
import unicorn from "eslint-plugin-unicorn";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "app/guide/**",
    ],
    rules: {
      // Next.js 환경: React 17+ 자동 JSX 런타임
      "react/react-in-jsx-scope": "off",
    },
  },
  // 컴포넌트 파일명 카멜케이스 강제
  {
    files: ["app/**/*.{ts,tsx}"],
    plugins: { unicorn },
    rules: {
      "unicorn/filename-case": [
        "error",
        { cases: { camelCase: true, pascalCase: false, kebabCase: false } },
      ],
    },
  },
  // Prettier와 충돌 가능한 규칙 비활성화
  prettier,
];

export default eslintConfig;
