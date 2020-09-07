import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import FormContainer from "./FormContainer";

const Reset = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Change password",
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    console.log(jwt.decode(token));
    setValues({ ...values, token, name });
  }, []);

  const { name, token, newPassword, buttonText } = values;

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
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: { resetPasswordLink: token, newPassword },
    })
      .then((response) => {
        console.log(`Forgot password success`, response);
        toast.success(response.data.message);
        setValues({ ...values, buttonText: "Password changed" });
      })
      .catch((error) => {
        console.log(`Forgot password error`, error.response.data);
        toast.error(error.response.data.error);
        setValues({ ...values, buttonText: "Change password" });
      });
  };

  return (
    <Layout>
      <ToastContainer />
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <h1 className="text-5xl mb-8 text-center">Hey {name}</h1>
          <h2 className="text-2xl mb-8 text-center">Reset Password</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              New Password <span class="text-red-400">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="newPassword"
              name="newPassword"
              autoComplete="off"
              type="password"
              placeholder="******************"
              value={newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-brand bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </FormContainer>
    </Layout>
  );
};

export default Reset;
