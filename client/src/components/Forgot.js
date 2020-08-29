import React, { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Link } from "react-router-dom";

const Forgot = ({ history }) => {
  const [values, setValues] = useState({
    email: "",
    buttonText: "Request password",
  });

  const { email, buttonText } = values;

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: { email },
    })
      .then((response) => {
        console.log(`Forgot password success`, response);
        toast.success(response.data.message);
        setValues({ ...values, buttonText: "Email Sent" });
      })
      .catch((error) => {
        console.log(`Forgot password error`, error.response.data);
        toast.error(error.response.data.error);
        setValues({ ...values, buttonText: "Request password" });
      });
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="container m-auto flex justify-center items-center">
        <form
          className="p-10 m-48 w-1/2 bg-white shadow-lg rounded"
          onSubmit={handleSubmit}
        >
          <h1 className="text-5xl mb-8 text-center">Forgot Password</h1>
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
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {buttonText}
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/signin"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Forgot;
