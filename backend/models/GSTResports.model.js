const mongoose = require('mongoose');

const GSTR1Schema = new mongoose.Schema({
  form: { type: String, required: true },
  year: { type: String, required: true },
  month: { type: String, required: true },
  company: {
    gstin: String,
    legalName: String,
    tradeName: String
  },
  filingPeriod: String,
  aggregateTurnover: Number,
  table4: Array,
  table7: Array,
  table12: Array,
  createdAt: { type: Date, default: Date.now }
});

const GSTR3BSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  totalTaxableValue: Number,
  totalCGST: Number,
  totalSGST: Number,
  totalIGST: Number,
  productsSold: Array,
  transactionCount: Number,
  hsnSummary: Array,
  createdAt: { type: Date, default: Date.now }
});

const GSTR1 = mongoose.model('GSTR1', GSTR1Schema);
const GSTR3B = mongoose.model('GSTR3B', GSTR3BSchema);

module.exports = { GSTR1, GSTR3B };