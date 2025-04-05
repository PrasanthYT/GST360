const express = require('express');
const router = express.Router();
const { generateGSTR1 } = require('../controllers/gstr1Controller');

router.get('/generate', generateGSTR1);

module.exports = router;