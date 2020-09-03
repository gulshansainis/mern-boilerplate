const { check } = require("express-validator");
const { ROLES, STATUS } = require("../utilities/constants");

exports.userRoleChangeValidator = [
  check("role").notEmpty().withMessage("Role is required"),
  check("role").isIn(ROLES).withMessage("Role is not valid"),
];

exports.userStatusChangeValidator = [
  check("status").notEmpty().withMessage("Status is required"),
  check("status").isIn(STATUS).withMessage("Status is not valid"),
];
