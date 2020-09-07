import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { authenticate, isAuth } from "../utility/helpers";
import FormContainer from "./FormContainer";
import Google from "./Google";

const OrgSignup = ({ history }) => {
  const [values, setValues] = useState({
    org_name: "",
    org_website: "",
    org_email_domain: "",
    primary_contact_name: "",
    primary_contact_email: "",
    buttonText: "Submit",
  });

  const {
    org_name,
    org_website,
    org_email_domain,
    primary_contact_name,
    primary_contact_email,
    buttonText,
  } = values;

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
      method: "POST",
      url: `${process.env.REACT_APP_API}/org/signup`,
      data: {
        org_name,
        org_website,
        org_email_domain,
        primary_contact_name,
        primary_contact_email,
      },
    })
      .then((response) => {
        console.log(`Organisation Signup success`, response);
        setValues({
          ...values,
          org_name: "",
          org_website: "",
          org_email_domain: "",
          primary_contact_name: "",
          primary_contact_email: "",
          buttonText: "Submitted",
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log(`Organisation Signup failed`, error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  return (
    <Layout>
      <ToastContainer />
      {isAuth() ? <Redirect to="/" /> : null}
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <h1 className="text-5xl mb-8 text-center">Organisation Sign Up</h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="org_name"
            >
              Organisation Name <span className="text-red-400">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
              id="org_name"
              name="org_name"
              autoComplete="off"
              type="text"
              placeholder="Example Ltd."
              value={org_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="org_website"
            >
              Organisation Website <span className="text-red-400">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
              id="org_website"
              name="org_website"
              autoComplete="off"
              type="text"
              placeholder="https://www.example.com"
              value={org_website}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="org_email_domain"
            >
              Organisation Email Domain <span className="text-red-400">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
              id="org_email_domain"
              name="org_email_domain"
              autoComplete="off"
              type="text"
              placeholder="example.com"
              value={org_email_domain}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="primary_contact_name"
            >
              Primary Contact Name <span className="text-red-400">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="primary_contact_name"
              name="primary_contact_name"
              autoComplete="off"
              type="text"
              placeholder="John Doe"
              value={primary_contact_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="primary_contact_email"
            >
              Primary Contact Email <span className="text-red-400">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="primary_contact_email"
              name="primary_contact_email"
              autoComplete="off"
              type="email"
              placeholder="johndoe@example.com"
              value={primary_contact_email}
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

export default OrgSignup;
