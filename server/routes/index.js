const express = require("express");
const router = express.Router();
const auth = require("./auth");
const user = require("./user");

// combine multiple routes
router.use(auth);
router.use(user);

module.exports = router;
