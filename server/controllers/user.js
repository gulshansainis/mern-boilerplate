const User = require("../models/User");
const Org = require("../models/Org");

exports.read = (req, res) => {
  const userId = req.user._id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
};

exports.update = (req, res) => {
  const { name, org_email, password } = req.body;

  User.findById(req.user._id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    } else {
      user.name = name;
    }

    if (!org_email) {
      return res.status(400).json({
        error: "Organisation email is required",
      });
    } else {
      user.org_email = org_email;
      user.org_email_domain = org_email.split("@")[1];
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password should be min 6 characters long",
        });
      } else {
        user.password = password;
      }
    }

    // check if organisation exists with domain name
    Org.findOne({ org_email_domain: user.org_email_domain }).exec(
      (error, org) => {
        if (error || !org) {
          console.log("User pofile update failed", error);
          return res.status(400).json({
            error: `Sorry, ${user.org_email_domain} domain is not registered`,
          });
        }

        user.save((error, updatedUser) => {
          if (error) {
            console.log("User pofile update failed", error);
            return res.status(400).json({
              error: "User profile update failed",
            });
          }

          updatedUser.hashed_password = undefined;
          updatedUser.salt = undefined;

          return res.json(updatedUser);
        });
      }
    );
  });
};
