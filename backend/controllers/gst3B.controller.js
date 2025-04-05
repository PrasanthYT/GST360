const { GSTR3B } = require('../models/GSTResports.model');
const POSTransaction = require('../models/posTransaction.model');

exports.generateGSTR3B = async (req, res) => {
    try {
      const startDate = "2025-04-01";
      const endDate = "2025-04-20";
      
      // 1. Get all transactions in date range
      const transactions = await POSTransaction.find({
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });

      // Return 404 if no transactions found
      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ 
          message: 'No transactions found for the specified date range',
          startDate,
          endDate
        });
      }

      // 2. Aggregate GST data
      const report = {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalTaxableValue: 0,
        totalCGST: 0,
        totalSGST: 0,
        totalIGST: 0,
        productsSold: [],
        transactionCount: transactions.length
      };

      transactions.forEach(tx => {
        report.totalTaxableValue += tx.subtotal;
        report.totalCGST += tx.totalCgst;
        report.totalSGST += tx.totalSgst;
        report.totalIGST += tx.totalIgst;

        tx.items.forEach(item => {
          report.productsSold.push({
            productId: item.productId,
            name: item.name,
            hsnCode: item.hsnCode,
            quantity: item.quantity,
            taxableValue: item.taxableValue,
            cgst: item.cgstAmount,
            sgst: item.sgstAmount,
            igst: item.igstAmount
          });
        });
      });

      // 3. Group by HSN code
      const hsnSummary = report.productsSold.reduce((acc, product) => {
        if (!acc[product.hsnCode]) {
          acc[product.hsnCode] = {
            hsnCode: product.hsnCode,
            totalQuantity: 0,
            totalValue: 0,
            totalCGST: 0,
            totalSGST: 0,
            totalIGST: 0
          };
        }
        acc[product.hsnCode].totalQuantity += product.quantity;
        acc[product.hsnCode].totalValue += product.taxableValue;
        acc[product.hsnCode].totalCGST += product.cgst;
        acc[product.hsnCode].totalSGST += product.sgst;
        acc[product.hsnCode].totalIGST += product.igst;
        return acc;
      }, {});

      report.hsnSummary = Object.values(hsnSummary);

      // Save the report to MongoDB
      const savedReport = await GSTR3B.create(report);

      res.json({
        message: 'GSTR-3B report generated and saved successfully',
        data: savedReport
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        details: 'Failed to generate GSTR-3B report' 
      });
    }
};