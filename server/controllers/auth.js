const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mail = require("@sendgrid/mail");
const expressJwt = require("express-jwt");
const _ = require("lodash");

mail.setApiKey(process.env.SENDGRID_API_KEY);
/*
exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    // user already exist
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    let newUser = new User({ name, email, password });

    newUser.save((err, success) => {
      if (err) {
        console.log("Signup error", error);
        return res.status(400).json({
          error: err,
        });
      }

      res.json({
        message: "Signup success!!",
      });
    });
  });
};
*/

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    // user already exist
    if (user) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    // generate activation token
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );

    const emailContext = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Activate your account`,
      html: `
        <h2>You're on your way!</h2>
        <h4>Let's confirm your email address.</h4>
        <p>By clicking on the following link, you are confirming your email address.</p>
        
        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>

        <hr/>
        <p>Link expires in 10 minutes.</p>
        <p>${process.env.CLIENT_URL}</p>
      `,
    };

    mail
      .send(emailContext)
      .then((sent) => {
        return res.json({
          message: `Account activation link sent to email ${email}.`,
        });
      })
      .catch((err) => {
        console.log(`Error in sending activation email`);
        return res.json({ message: err.message });
      });
  });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  // check validity of token
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
      err,
      decoded
    ) {
      if (err) {
        console.log("Account activation link error");
        return res.status(401).json({
          error: "Activation link expired. Signup again",
        });
      }

      const { name, email, password } = decoded;

      let user = new User({ name, email, password });

      user.save((error, success) => {
        if (error) {
          console.log("Error saving user", error);
          if (error.message.indexOf("duplicate key") !== -1) {
            return res.status(400).json({
              error: "Account already activated. Please signin",
            });
          }
          return res.status(400).json({
            error: "Error saving user. Plese try again after sometime",
          });
        }

        return res.json({
          message: "Signup success!! Please signin.",
        });
      });
    });
  } else {
    return res.json({
      message: "Something went wrong!! Try again.",
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    // check user exist
    if (err || !user) {
      return res.status(400).json({
        error: "User does not exist. Please signup",
      });
    }

    // check account details match
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and Password do not match",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.isAuthorised = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
});

exports.isAdmin = (req, res, next) => {
  User.findById(req.user._id).exec((err, user) => {
    // check user exist
    if (err || !user) {
      return res.status(400).json({
        error: "User does not exist. Please signup",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin area - access denied",
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }).exec((err, user) => {
    // check user exist
    if (err || !user) {
      return res.status(400).json({
        error: "User does not exist. Please signup",
      });
    }

    // generate activation token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );

    // add reset password token in db
    user.updateOne({ resetPasswordLink: token }, (err, sucess) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save token in database",
        });
      }

      const emailContext = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Reset Password`,
        html: `
          <h2>Reset your account password</h2>
          
          <p>By clicking on the following link.</p>
          
          <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
  
          <hr/>
          <p>Link expires in 10 minutes.</p>
          <p>${process.env.CLIENT_URL}</p>
        `,
      };

      mail
        .send(emailContext)
        .then((sent) => {
          return res.json({
            message: `Reset password link sent to email ${email}.`,
          });
        })
        .catch((err) => {
          console.log(`Error in sending reset password email`);
          return res.json({ message: err.message });
        });
    });
  });
};

exports.resetPassword = (req, res) => {
  // token gives user id
  // new password
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      // if link/token expired
      if (err) {
        return res.status(400).json({
          error: "Expired link, please try again",
        });
      }

      User.findOne({ resetPasswordLink }, (err, user) => {
        // check user exist
        if (err || !user) {
          return res.status(400).json({
            error: "Something went wrong, please try again",
          });
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: "",
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error resetting user password",
            });
          }

          return res.json({
            message: `Password reset successful`,
          });
        });
      });
    });
  }
};
