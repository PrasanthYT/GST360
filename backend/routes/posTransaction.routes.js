const express = require('express');
const router = express.Router();
const controller = require('../controllers/posTransaction.controller');

router.post('/sales', controller.createSale);
router.get('/sales', controller.getAllSales);
router.get('/sales/:id', controller.getSaleById);
router.get('/products', controller.getAvailableProducts);

module.exports = router;