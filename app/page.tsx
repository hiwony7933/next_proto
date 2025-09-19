import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';
import '@/styles/common.scss';

const tenants = [
  {
    name: 'SK',
    href: '/sk',
  },
  {
    name: 'CAP',
    href: '/cap',
  },
  {
    name: 'ADT',
    href: '/adt',
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Hello World</h1>
      <div className={styles.tenantsContainer}>
        {tenants.map((tenant) => (
          <Link key={tenant.name} href={tenant.href}>
            {tenant.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
