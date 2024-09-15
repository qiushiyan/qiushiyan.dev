import React from "react";

import { Container } from "@/components/container";
import { SiteNav } from "@/components/nav/site-nav";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNav />
      <Container>{children}</Container>
    </>
  );
}
