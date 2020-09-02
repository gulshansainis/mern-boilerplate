import React from "react";
import Nav from "./Nav";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col bg-gray-100 h-screen">
      <header className="shadow-md bg-white">
        <Nav />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
