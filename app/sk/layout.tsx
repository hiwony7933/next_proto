import React from "react";
import Header from "./layouts/header";
import Footer from "./layouts/footer";
import ClientMain from "@/app/sk/layouts/mainClient";
import BreadCrumb from "@/app/common/components/molecule/breadCrumb";
import FloatingButtons from "@/app/sk/components/floatingButtons";
import { skHeaderMenus } from "./components/data/mainPage";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <ClientMain className="layout__main">
        <BreadCrumb items={skHeaderMenus} />
        {children}
      </ClientMain>
      <Footer />
      <FloatingButtons />
    </>
  );
}
