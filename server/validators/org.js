const { check } = require("express-validator");
const { ROLES, STATUS } = require("../utilities/constants");

exports.orgSignupValidator = [
  check("org_name").notEmpty().withMessage("Organisation name is required"),
  check("org_website")
    .notEmpty()
    .withMessage("Organisation website is required"),
  check("org_email_domain")
    .notEmpty()
    .withMessage("Valid Organisation email domain is required"),
  check("primary_contact_name")
    .notEmpty()
    .withMessage("Primary contact name is required"),
  check("primary_contact_email")
    .notEmpty()
    .withMessage("Valid email required of primary contact"),
  check("primary_contact_email")
    .isEmail()
    .withMessage("Valid email required of primary contact"),
];

exports.userRoleChangeValidator = [
  check("role").notEmpty().withMessage("Role is required"),
  check("role").isIn(ROLES).withMessage("Role is not valid"),
];

exports.userStatusChangeValidator = [
  check("status").notEmpty().withMessage("Status is required"),
  check("status").isIn(STATUS).withMessage("Status is not valid"),
];
