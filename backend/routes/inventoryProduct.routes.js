const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventoryProduct.controller');

router.post('/', controller.addProduct);
router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductsById);
router.patch('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

module.exports = router;
