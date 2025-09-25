import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";
import unicorn from "eslint-plugin-unicorn";
import jsxA11y from "eslint-plugin-jsx-a11y";

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
  // 파일명 규칙: 비-컴포넌트는 camelCase, 컴포넌트 경로는 PascalCase 허용
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { unicorn },
    rules: {
      "unicorn/filename-case": [
        "error",
        { cases: { camelCase: true, pascalCase: true, kebabCase: false } },
      ],
    },
  },
  // 접근성(a11y) 구조/마크업 중심 규칙
  {
    files: ["**/*.{tsx,jsx}"],
    ignores: [
      // 가이드 샘플 코드는 화면 우선으로 린트 제외
      "app/guide/**",
    ],
    plugins: { "jsx-a11y": jsxA11y },
    rules: {
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/control-has-associated-label": ["error", { depth: 2 }],
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/no-noninteractive-tabindex": "warn",
    },
  },
  // Prettier와 충돌 가능한 규칙 비활성화
  prettier,
];

export default eslintConfig;
