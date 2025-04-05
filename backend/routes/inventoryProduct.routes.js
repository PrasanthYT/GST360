const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventoryProduct.controller');
const { generateGSTR1 } = require('../controllers/gstr1Controller');


router.post('/', controller.addProduct);
router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductsById);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);
router.get('/generate-gstr1', generateGSTR1);

module.exports = router;
