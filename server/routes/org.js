const express = require("express");
const {
  signup,
  accountActivation,
  allUsers,
  changeStatus,
  changeRole,
} = require("../controllers/org");
const { isAdmin, isAuthorised } = require("../controllers/auth");
const {
  userRoleChangeValidator,
  userStatusChangeValidator,
} = require("../validators/org");
const router = express.Router();
const { runValidation } = require("../validators");

// ROUTES
router.post("/org/signup", signup);
router.post("/org/account-activation", accountActivation);

// user actions
router.get("/org/user/all", isAuthorised, isAdmin, allUsers);
router.put(
  "/org/user/status/:id",
  userStatusChangeValidator,
  runValidation,
  isAuthorised,
  isAdmin,
  changeStatus
);
router.put(
  "/org/user/role/:id",
  userRoleChangeValidator,
  runValidation,
  isAuthorised,
  isAdmin,
  changeRole
);

module.exports = router;
