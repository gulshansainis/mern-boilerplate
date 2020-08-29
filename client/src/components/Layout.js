import React from "react";
import Nav from "./Nav";

const Layout = ({ children }) => {
  return (
    <div className="wrapper">
      <header>
        <Nav />
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
