import React from "react";
import Nav from "./Nav";

const FormContainer = ({ children }) => {
  return (
    <div className="sm:container mx-auto bg-white shadow-lg rounded py-20 px-56 mt-20 bg-black-600">
      {children}
    </div>
  );
};

export default FormContainer;
