import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const OrgActivate = ({ match, history }) => {
  const [values, setValues] = useState({
    org_name: "",
    primary_contact_name: "",
    token: "",
    showActivateButton: true,
  });

  const { org_name, primary_contact_name, token, showActivateButton } = values;

  useEffect(() => {
    let token = match.params.token;
    let { org_name, primary_contact_name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, org_name, primary_contact_name, token });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/org/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log(`Organnisation account activation success`, response);
        setValues({
          ...values,
          showActivateButton: false,
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log(
          `Organisation account activation failed`,
          error.response.data.error
        );
        if (
          error.response.data.error.indexOf(
            "Organisation account already activated"
          ) !== -1
        ) {
          setValues({ ...values, showActivateButton: false });
        }
        toast.error(error.response.data.error);
      });
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="container m-auto  text-center p-10 m-48 w-1/2 ">
        <h1 className="text-5xl mb-8">Hey {primary_contact_name}</h1>
        <h2 className="text-3xl mb-8">
          Ready to activate <u>{org_name}</u> account?
        </h2>
        {showActivateButton ? (
          <button
            className="bg-blue-brand bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Activate
          </button>
        ) : (
          <h3>
            Congrats!!! You have successfully activated {org_name} acccount
          </h3>
        )}
      </div>
    </Layout>
  );
};

export default OrgActivate;
