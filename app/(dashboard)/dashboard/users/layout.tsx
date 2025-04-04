import React, { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
