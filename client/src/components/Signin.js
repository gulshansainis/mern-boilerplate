import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { authenticate, isAuth } from "../utility/helpers";
import Google from "./Google";
import FormContainer from "./FormContainer";

const Signin = ({ history }) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { email, password, buttonText } = values;

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleGoogleLogin = (response) => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin")
        : history.push("/");
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    })
      .then((response) => {
        console.log(`Signin success`, response.data.user.name);
        authenticate(response, () => {
          setValues({
            ...values,
            email: "",
            password: "",
            buttonText: "Submitted",
          });
          toast.success(`Welcome ${response.data.user.name}`);
          isAuth() && isAuth().role === "admin"
            ? history.push("/admin")
            : history.push("/");
        });
      })
      .catch((error) => {
        if (error.message.indexOf("Network Error") !== -1) {
          console.log(`Signin failed`, error.message);
          setValues({ ...values, buttonText: "Submit" });
          toast.error(error.message);
        } else {
          console.log(`Signin failed`, error.response.data);
          setValues({ ...values, buttonText: "Submit" });
          toast.error(error.response.data.error);
        }
      });
  };

  return (
    <Layout>
      <ToastContainer />
      {isAuth() ? <Redirect to="/" /> : null}
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <h1 className="text-5xl mb-8 text-center">Sign In</h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              autoComplete="off"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              autoComplete="off"
              type="password"
              placeholder="******************"
              value={password}
              onChange={handleChange}
            />
            {/* <p className="text-red-500 text-xs italic">
            Please choose a password.
          </p> */}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {buttonText}
            </button>
            <div className="flex flex-col">
              <Link
                className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800"
                to="/signup"
              >
                Sign Up
              </Link>
              <Link
                className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800"
                to="/auth/password/forgot"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <Google handleGoogleLogin={handleGoogleLogin} />
        </form>
      </FormContainer>
    </Layout>
  );
};

export default Signin;
