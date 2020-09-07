import React from "react";
import Layout from "./components/Layout";
import "./App.css";
import Hero from "./components/Hero";
import Chat from "./components/Chat";
import { isAuth } from "./utility/helpers";

const App = ({ history }) => {
  //   const { _id, org_email_domain } = isAuth();
  return (
    <Layout>
      {!isAuth() ? (
        <Hero />
      ) : isAuth().org_email_domain ? (
        <Chat />
      ) : (
        history.push("/edit/profile")
      )}
    </Layout>
  );
};

export default App;
