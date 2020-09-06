const express = require("express");
const router = express.Router();

// combine multiple routes
router.use("/ping", (req, res) => res.json({ message: "Server is up!!" }));

module.exports = router;
