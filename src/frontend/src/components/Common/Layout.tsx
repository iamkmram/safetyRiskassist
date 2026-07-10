 
 
import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    {children}
  </div>
);

export default Layout;

export {};
