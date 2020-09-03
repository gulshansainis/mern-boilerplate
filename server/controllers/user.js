const User = require("../models/User");

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
  const { name, orgEmail, password } = req.body;

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

    if (!orgEmail) {
      return res.status(400).json({
        error: "Organisation email is required",
      });
    } else {
      user.orgEmail = orgEmail;
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
  });
};
