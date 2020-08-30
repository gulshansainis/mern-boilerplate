import React from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";

const Google = ({ handleGoogleLogin }) => {
  const responseGoogle = (response) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/google-login`,
      data: { idToken: response.tokenId },
    })
      .then((response) => {
        console.log(`Google signin success ${response}`);
        // inform encolosing component
        handleGoogleLogin(response);
      })
      .catch((error) => {
        console.log(`Google signin failed ${error.response}`);
      });
  };

  return (
    <div className="my-6">
      <GoogleLogin
        className="w-full"
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default Google;
