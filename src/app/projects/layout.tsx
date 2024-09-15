import React from "react";

import "./layout.scss";

import { SiteNav } from "@/components/nav/site-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
    </>
  );
}
