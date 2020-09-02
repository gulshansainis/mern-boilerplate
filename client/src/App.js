import React from "react";
import Layout from "./components/Layout";
import "./App.css";
import Hero from "./components/Hero";
import { isAuth } from "./utility/helpers";

const App = () => <Layout>{isAuth() ? <h1>Chat Area</h1> : <Hero />}</Layout>;

export default App;
