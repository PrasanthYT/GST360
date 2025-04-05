const POSTransaction = require('../models/posTransaction.model');
const InventoryProduct = require('../models/inventoryProduct.model');

exports.createSale = async (req, res) => {
    try {
      const itemsWithTaxDetails = [];
      
      // Fetch product details and calculate taxes
      for (const item of req.body.items) {
        const product = await InventoryProduct.findOne({ productId: item.productId });
        if (!product) {
          return res.status(400).json({ error: `Product ${item.productId} not found` });
        }
        if (product.quantity < item.quantity) {
          return res.status(400).json({ 
            error: `Only ${product.quantity} ${product.name} available` 
          });
        }
  
        itemsWithTaxDetails.push({
          ...item,
          mrp: product.mrp,
          costPrice: product.costPrice,
          hsnCode: product.hsnCode,
          cgstRate: product.cgstRate,
          sgstRate: product.sgstRate,
          igstRate: product.igstRate
        });
      }
  
      const transaction = new POSTransaction({
        ...req.body,
        items: itemsWithTaxDetails,
        isInterState: req.body.isInterState || false
      });
  
      await transaction.save();
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

exports.getAllSales = async (req, res) => {
  try {
    const sales = await POSTransaction.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await POSTransaction.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailableProducts = async (req, res) => {
  try {
    const products = await InventoryProduct.find(
      { quantity: { $gt: 0 } },
      'productId name sku mrp quantity variants'
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};