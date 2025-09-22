import React from "react";
import adminLayout from "./adminLayout.module.scss";

export default function AdminMgmtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={adminLayout.adminDefaultLayout}>{children}</div>;
}
