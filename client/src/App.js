import React from "react";
import Layout from "./components/Layout";
import "./App.css";
import Hero from "./components/Hero";
import Chat from "./components/Chat";
import { isAuth } from "./utility/helpers";

const App = () => <Layout>{isAuth() ? <Chat /> : <Hero />}</Layout>;

export default App;
