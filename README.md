This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 스타일 가이드

### CSS Modules + BEM (camelCase 접근)

- 컴포넌트 전용 스타일은 SCSS Modules와 BEM 네이밍을 사용합니다.
- 하이픈(-)이 포함된 클래스는 JS/TS에서 camelCase로 접근할 수 있습니다.
  - `.header-container` → `styles.headerContainer`
  - `.card__button--primary` → `styles.card__buttonPrimary`
- SCSS에서는 BEM 표기를 그대로 유지하고, JS/TS 접근만 camelCase를 사용합니다.
- 필요 시 브래킷 표기도 가능: `styles['card__button--primary']`.

예시 (SCSS):

```scss
.card {
  /* Block styles */
  border: 1px solid #eee;

  &__title {
    /* Element styles */
    font-size: 1.2rem;
  }

  &__button {
    /* Element styles */
    padding: 8px;

    &--primary {
      /* Modifier styles */
      background-color: blue;
      color: white;
    }
  }
}
```

예시 (TSX):

```tsx
<div className={styles.card}>
  <h2 className={styles.card__title}>Card Title</h2>
  <button className={`${styles.card__button} ${styles.card__buttonPrimary}`}>
    Action
  </button>
</div>
```

주의사항

- SCSS는 BEM 규칙(언더스코어/대시)을 그대로 사용하고, JS/TS에서는 대시가 포함된 부분만 camelCase 접근을 지원합니다.
- 기존 브래킷 접근 코드가 있다면 일관성을 위해 점 표기(camelCase)로 점진 전환을 권장합니다.
