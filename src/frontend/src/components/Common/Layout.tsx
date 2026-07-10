import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <div className="min-h-screen flex flex-col">{children}</div>;
}
