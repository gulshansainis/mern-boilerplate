const express = require("express");
const router = express.Router();
const { read, update } = require("../controllers/user");
const { isAuthorised, isAdmin } = require("../controllers/auth");

router.get("/user/:id", isAuthorised, read);
router.put("/user/update", isAuthorised, update);
router.put("/admin/update", isAuthorised, isAdmin, update);

module.exports = router;
