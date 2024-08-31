import React from "react";

import "./layout.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
