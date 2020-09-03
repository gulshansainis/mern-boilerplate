const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
];

exports.userSigninValidator = [
  check("email").notEmpty().withMessage("Email is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
];

exports.forgotPasswordValidator = [
  check("email").notEmpty().withMessage("Email is required"),
  check("email").isEmail().withMessage("Valid email is required"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
];
