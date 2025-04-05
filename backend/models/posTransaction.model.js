const mongoose = require('mongoose');

const soldItemSchema = new mongoose.Schema({
    // Product Identity
    productId: { type: String, required: true, ref: 'inventoryproducts' },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    hsnCode: { type: String, required: true },
    
    // Pricing and Quantities
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Selling price
    mrp: { type: Number }, // Max Retail Price
    costPrice: { type: Number }, // For profit analysis
    
    // GST Breakdown
    cgstRate: { type: Number, default: 0.09 },
    sgstRate: { type: Number, default: 0.09 },
    igstRate: { type: Number, default: 0.18 },
    taxableValue: { type: Number }, // price * quantity
    cgstAmount: { type: Number },
    sgstAmount: { type: Number },
    igstAmount: { type: Number },
    
    // Final Calculation
    total: { type: Number }, // taxableValue + taxes
    discount: { type: Number, default: 0 },
    
    // Metadata
    soldAt: { type: Date, default: Date.now },
    invoiceNumber: { type: String } // Parent invoice reference
  });


const posTransactionSchema = new mongoose.Schema({
  invoiceNumber: { 
    type: String, 
    required: true,
    unique: true,
    default: () => `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  },
  items: [soldItemSchema],
  subtotal: { type: Number },
  totalTaxableValue: { type: Number },
  totalCgst: { type: Number, default: 0 },
  totalSgst: { type: Number, default: 0 },
  totalIgst: { type: Number, default: 0 },
  totalTax: { type: Number },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'upi', 'credit'], 
    default: 'cash' 
  },
  customerName: { type: String, default: 'Walk-in Customer' },
  customerPhone: { type: String },
  customerGSTIN: { type: String },
  seller: { type: String, required: true },
  isInterState: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Calculate taxes and totals before saving
posTransactionSchema.pre('save', function(next) {
  this.items.forEach(item => {
    // Get tax rates from product (will be populated from inventory)
    const cgstRate = item.cgstRate || 0;
    const sgstRate = item.sgstRate || 0;
    const igstRate = item.igstRate || 0;
    
    item.taxableValue = item.price * item.quantity;
    
    if (this.isInterState) {
      // Interstate - IGST applies
      item.igstAmount = item.taxableValue * igstRate;
      item.cgstAmount = 0;
      item.sgstAmount = 0;
    } else {
      // Intrastate - CGST+SGST applies
      item.cgstAmount = item.taxableValue * cgstRate;
      item.sgstAmount = item.taxableValue * sgstRate;
      item.igstAmount = 0;
    }
    
    item.total = item.taxableValue + item.cgstAmount + item.sgstAmount + item.igstAmount;
  });

  // Calculate invoice totals
  this.subtotal = this.items.reduce((sum, item) => sum + item.taxableValue, 0);
  this.totalCgst = this.items.reduce((sum, item) => sum + item.cgstAmount, 0);
  this.totalSgst = this.items.reduce((sum, item) => sum + item.sgstAmount, 0);
  this.totalIgst = this.items.reduce((sum, item) => sum + item.igstAmount, 0);
  this.totalTax = this.totalCgst + this.totalSgst + this.totalIgst;
  this.grandTotal = this.subtotal + this.totalTax - this.discount;
  
  next();
});

// Update inventory after sale (same as before)
posTransactionSchema.post('save', async function(doc) {
    const InventoryProduct = mongoose.model('inventoryproducts');
    
    for (const item of doc.items) {
      const saleRecord = {
        date: doc.createdAt,
        invoiceNumber: doc.invoiceNumber,
        quantity: item.quantity,
        price: item.price,
        taxableValue: item.taxableValue,
        cgstAmount: item.cgstAmount,
        sgstAmount: item.sgstAmount,
        igstAmount: item.igstAmount
      };
  
      await InventoryProduct.findOneAndUpdate(
        { productId: item.productId },
        {
          $inc: { 
            quantity: -item.quantity,
            'salesData.totalSold': item.quantity,
            'salesData.totalRevenue': item.taxableValue,
            'salesData.totalTaxCollected.cgst': item.cgstAmount,
            'salesData.totalTaxCollected.sgst': item.sgstAmount,
            'salesData.totalTaxCollected.igst': item.igstAmount
          },
          $push: { 'salesData.salesHistory': saleRecord }
        }
      );
    }
  });

module.exports = mongoose.model('POSTransaction', posTransactionSchema);