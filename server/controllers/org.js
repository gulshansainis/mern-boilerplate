/**
 * File: controllers/org.js
 *
 * Controller to handle read, update and manage organisation data including users
 */
const Org = require("../models/Org");
const jwt = require("jsonwebtoken");
const mail = require("@sendgrid/mail");
const _ = require("lodash");
const User = require("../models/User");
const Chat = require("../models/Chat");

mail.setApiKey(process.env.SENDGRID_API_KEY);

exports.allUsers = (req, res) => {
  // get admin profile (populated by isAdmin m/w)
  const { profile } = req;
  const { _id: adminId, org_email_domain } = profile;

  // find users by filtering domain
  User.find({ _id: { $ne: adminId }, org_email_domain })
    .select("name org_email_domain status")
    .exec((err, users) => {
      if (err || !users) {
        return res.status(400).json({
          error: "No user found",
        });
      }
      res.json(users);
    });
};

exports.changeStatus = (req, res) => {
  const { status } = req.body;
  const _id = req.params.id;

  User.findOne({ _id }).exec((err, user) => {
    // check user exist
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // TODO : move this to middlerware
    // check if admin is of same org
    if (req.profile.org_email_domain !== user.org_email_domain) {
      return res.status(401).json({
        error: "You are not authorised to perform this action",
      });
    }

    // add reset password token in db
    user.updateOne({ status }, (err, sucess) => {
      if (err) {
        return res.status(400).json({
          error: "User status update failed",
        });
      }

      return res.json({
        message: `Status updated successfully`,
      });
    });
  });
};

exports.changeRole = (req, res) => {
  const { role } = req.body;
  const _id = req.params.id;

  User.findOne({ _id }).exec((err, user) => {
    // check user exist
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // TODO : move this to middlerware
    // check if admin is of same org
    if (req.profile.org_email_domain !== user.org_email_domain) {
      return res.status(401).json({
        error: "You are not authorised to perform this action",
      });
    }

    // add reset password token in db
    user.updateOne({ role }, (err, sucess) => {
      if (err) {
        return res.status(400).json({
          error: "User status update failed",
        });
      }

      return res.json({
        message: `Role updated successfully`,
      });
    });
  });
};

exports.removeUser = (req, res) => {
  const _id = req.params.id;

  User.findOne({ _id }).exec((err, user) => {
    // check user exist
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // TODO : move this to middlerware
    // check if admin is of same org
    if (req.profile.org_email_domain !== user.org_email_domain) {
      return res.status(401).json({
        error: "You are not authorised to perform this action",
      });
    }

    // add reset password token in db
    user.updateOne(
      { status: "disabled", org_email: "", org_email_domain: "" },
      (err, success) => {
        if (err) {
          return res.status(400).json({
            error: "Failed to remove user",
          });
        }

        return res.json({
          message: `User removed successfully`,
        });
      }
    );
  });
};

exports.chatHistory = async (req, res) => {
  const { id1, id2 } = req.params;

  const user1 = await User.findById(id1);
  const user2 = await User.findById(id2);

  // TODO : move this to middlerware
  // check if admin is of same org
  // and all user are of same organisation
  console.log(
    req.profile.org_email_domain === user1.org_email_domain &&
      req.profile.org_email_domain === user2.org_email_domain
  );
  if (
    req.profile.org_email_domain === user1.org_email_domain &&
    req.profile.org_email_domain === user2.org_email_domain
  ) {
    // get unique id for chat
    const uid = [id1, id2].sort().join("_");

    Chat.find({ uid }).exec((err, chats) => {
      // check user exist
      if (err || !chats) {
        return res.status(400).json({
          error: "No chat history found",
        });
      }
      return res.json(chats);
    });
  } else {
    return res.status(401).json({
      error: "You are not authorised to perform this action",
    });
  }
};

exports.signup = (req, res) => {
  const {
    org_name,
    org_website,
    org_email_domain,
    primary_contact_name,
    primary_contact_email,
  } = req.body;

  Org.findOne({ org_email_domain }).exec((err, org) => {
    // org already exist
    if (org) {
      return res.status(400).json({
        error: "Organisation already registered",
      });
    }

    // generate activation token
    const token = jwt.sign(
      {
        org_name,
        org_website,
        org_email_domain,
        primary_contact_name,
        primary_contact_email,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );

    const emailContext = {
      from: process.env.EMAIL_FROM,
      to: primary_contact_email,
      subject: `${org_name} - Activate your account`,
      html: `
        <h2>You're are ready to connect folks at ${org_name}!</h2>
        
        <h4>Activate your account</h4>
        <p>By clicking on the following link</p>
        
        <p>${process.env.CLIENT_URL}/org/activate/${token}</p>

        <hr/>
        <p>Link expires in 10 minutes.</p>
        <p>${process.env.CLIENT_URL}</p>
      `,
    };

    mail
      .send(emailContext)
      .then((sent) => {
        return res.json({
          message: `Organisation activation link sent to email ${primary_contact_email}.`,
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

      const {
        org_name,
        org_website,
        org_email_domain,
        primary_contact_name,
        primary_contact_email,
      } = decoded;

      let org = new Org({
        org_name,
        org_website,
        org_email_domain,
        primary_contact_name,
        primary_contact_email,
        status: "active",
      });

      org.save((error, success) => {
        if (error) {
          console.log("Error saving organisation", error);
          if (error.message.indexOf("duplicate key") !== -1) {
            return res.status(400).json({
              error: "Account already activated. Please signin",
            });
          }
          return res.status(400).json({
            error: "Error saving organisation. Plese try again after sometime",
          });
        }

        // create admin account
        let password = primary_contact_email + process.env.JWT_SECRET;
        let role = "admin";
        let user = new User({
          name: primary_contact_name,
          email: primary_contact_email,
          org_email: primary_contact_email,
          password,
          role,
          status: "active",
          org_email_domain,
        });

        user.save((err, data) => {
          if (err) {
            console.log(`Error creating user profile ${err}`);
            return res.status(400).json({
              error: "Organisation activation, User creation failed ",
            });
          }

          // generate activation token
          const token = jwt.sign(
            { id: data._id, name: data.name },
            process.env.JWT_RESET_PASSWORD,
            {
              expiresIn: "10m",
            }
          );

          // add reset password token in db
          user.updateOne({ resetPasswordLink: token }, (err, sucess) => {
            if (err) {
              return res.status(400).json({
                error:
                  "Organisation activation, Unable to save token in database",
              });
            }

            const emailContext = {
              from: process.env.EMAIL_FROM,
              to: primary_contact_email,
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
                  message: `Activation success!! Your account has been created. Please check your mail to rest password.`,
                });
              })
              .catch((err) => {
                console.log(
                  `Organisation activation, error in sending reset password email`
                );
                return res.json({ message: err.message });
              });
          });
        });
      });
    });
  } else {
    return res.json({
      message: "Something went wrong!! Try again.",
    });
  }
};
