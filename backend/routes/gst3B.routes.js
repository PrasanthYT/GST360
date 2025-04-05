const express = require("express");
const router = express.Router();
const gst3B = require('../controllers/gst3B.controller')

router.get("/3b", gst3B.generateGSTR3B);


module.exports = router;
