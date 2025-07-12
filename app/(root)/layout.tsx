import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <div className="container mx-auto mt-5">{children}</div>;
};

export default Layout;
