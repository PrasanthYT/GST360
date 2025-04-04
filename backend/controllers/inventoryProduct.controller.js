const Product = require('../models/inventoryProduct.model')

exports.addProduct = async (req, res) => {
    try {
        const product = new Product(req.body)
        const saved = await product.save()
        res.status(201).json(saved);
    } catch(err) {
        res.status(400).json({error: err.message})
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
        res.status(200).json(products)
    } catch(err) {
        res.status(500).json({error: err.message})
    }
}

exports.getProductsById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({error: 'Product not found'})
        }
        res.status(200).json(product)
    } catch(err) {
        res.status(500).json({error: err.message})
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!updateProduct){
            return res.status(404).json({error: 'Product not found'})
        }
        res.status(200).json(updateProduct)
    } catch(err) {
        res.status(500).json({error: err.message})
    }
}

exports.deleteProduct = async (req, res) => {
    try {
      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted){
        return res.status(404).json({ error: 'Not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };