import React from 'react';
import Header from './layouts/header';
import Footer from './layouts/footer';
import styles from './layout.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className={styles.container__main}>{children}</main>
      <Footer />
    </>
  );
}
