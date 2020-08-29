import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Activate = ({ match, history }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    showActivateButton: true,
  });

  const { name, token, showActivateButton } = values;

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log(`Account activation success`, response);
        setValues({
          ...values,
          showActivateButton: false,
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log(`Account activation failed`, error.response.data.error);
        if (
          error.response.data.error.indexOf(
            "Account already activated. Please signin"
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
        <h1 className="text-5xl mb-8">Hey {name}</h1>
        <h2 className="text-3xl mb-8">Ready to activate account?</h2>
        {showActivateButton ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Activate
          </button>
        ) : (
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              history.push("/signin");
            }}
          >
            Sign In
          </Link>
        )}
      </div>
    </Layout>
  );
};

export default Activate;
