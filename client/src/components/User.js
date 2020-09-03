import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth, getCookie, signout, updateUser } from "../utility/helpers";
import FormContainer from "./FormContainer";

const User = ({ history }) => {
  const [values, setValues] = useState({
    role: "",
    name: "",
    email: "",
    orgEmail: "",
    password: "",
    buttonText: "Submit",
  });

  const { role, name, email, orgEmail, password, buttonText } = values;
  const token = getCookie("token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(`Profile fetch ${JSON.stringify(response.data)}`);
        const { role, name, email, orgEmail } = response.data;
        setValues({
          ...values,
          role,
          name,
          email,
          orgEmail,
        });
      })
      .catch((error) => {
        console.log(`Profile fetch error ${error.response.data.error}`);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
      });
  };

  return (
    <Layout>
      <ToastContainer />
      <FormContainer>
        <h1 className="text-center text-3xl">USER AREA</h1>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </FormContainer>
    </Layout>
  );
};

export default User;
