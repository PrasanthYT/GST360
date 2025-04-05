const express = require("express");
const router = express.Router();
const { getGSTNDetails } = require("../controllers/gstin.controller");

router.post("/gstn", getGSTNDetails);

module.exports = router;
