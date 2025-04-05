const mongoose = require('mongoose');

// Variant Schema
const variantSchema = new mongoose.Schema({
  variantId: String,
  name: String,
  sku: String,   // Unique code for each product                                             
  quantity: Number,
  price: Number
});

// Product Schema
const inventoryProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  brand: { type: String },
  sku: { type: String, required: true, unique: true },      // Unique code for each product
  uom: { type: String, default: 'Nos' },

  // Price
  mrp: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  profitMargin: {type: Number},
  
  // GST
  hsnCode: { type: String, required: true },
  cgstRate: { type: Number, default: 0.09 },
  sgstRate: { type: Number, default: 0.09 },
  igstRate: { type: Number, default: 0.18 },
  totalGstRate: { type: Number, default: 0.18 },
  gstIncluded: { type: Boolean, default: true },
  isInterState: { type: Boolean, default: false },
  taxType: { type: String},


  quantity: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 5 },  // minimum quantity of a product should be in stock
  warehouseLocation: { type: String },

  variants: [variantSchema],

  images: [String],

  // Supplier details
  supplier: { type: String },
  supplierGSTIN: { type: String },
  supplierContact: { type: String },
  invoiceNo: { type: String },
  invoiceDate: { type: Date },

  batchNo: { type: String },
  expiryDate: { type: Date },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  salesData: {
    totalSold: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalTaxCollected: { 
      cgst: { type: Number, default: 0 },
      sgst: { type: Number, default: 0 },
      igst: { type: Number, default: 0 }
    },
    salesHistory: [{
      date: { type: Date, default: Date.now },
      invoiceNumber: String,
      quantity: Number,
      price: Number,
      taxableValue: Number,
      cgstAmount: Number,
      sgstAmount: Number,
      igstAmount: Number
    }]
  }
});

// Profit margin and Tax Type
inventoryProductSchema.pre('save', function(next){
    this.profitMargin = this.mrp - this.costPrice;
    this.taxType = this.isInterState ? 'InterState' : 'IntraState'
    this.updatedAt = Date.now();
    next();
})


module.exports = mongoose.model('inventoryproducts', inventoryProductSchema);
