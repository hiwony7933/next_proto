import styles from "./page.module.scss";
import Link from "next/link";

const tenants = [
  {
    name: "SK",
    href: "/sk",
  },
  {
    name: "CAP",
    href: "/cap",
  },
  {
    name: "ADT",
    href: "/adt",
  },
];

export default function Home() {
  return (
    <main className={styles.home}>
      <h1>Hello World</h1>
      <div className={styles.home__tenants}>
        {tenants.map((tenant) => (
          <Link key={tenant.name} href={tenant.href}>
            {tenant.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
