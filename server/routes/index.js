const express = require("express");
const router = express.Router();
const ping = require("./ping");
const auth = require("./auth");
const user = require("./user");
const org = require("./org");

// combine multiple routes
router.use(ping);
router.use(auth);
router.use(user);
router.use(org);

module.exports = router;
