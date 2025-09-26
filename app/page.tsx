import styles from "./page.module.scss";
import Link from "next/link";

function buildLocalUrl(sub: string) {
  // dev 서버 포트는 3000 가정; 프록시 사용 시 변경 가능
  const port = process.env.NEXT_PUBLIC_PORT || "3000";
  return `http://${sub}.localhost:${port}`;
}

const tenants = [
  { name: "SK", href: buildLocalUrl("sk") },
  { name: "CAP", href: buildLocalUrl("cap") },
  { name: "ADT", href: buildLocalUrl("adt") },
];

export default function Home() {
  return (
    <main className={styles.home}>
      <h1>테넌트 포털</h1>
      <div className={styles.home__tenants}>
        {tenants.map((t) => (
          <Link key={t.name} href={t.href} prefetch={false}>
            {t.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
