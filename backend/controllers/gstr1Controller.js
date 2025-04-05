const InventoryProduct = require('../models/inventoryProduct.model');
const moment = require('moment');

exports.generateGSTR1 = async (req, res) => {
  try {
    // Define the previous month’s start and end dates.
    const startDate = moment().subtract(1, 'months').startOf('month').toDate();
    const endDate = moment().subtract(1, 'months').endOf('month').toDate();

    // Fetch products added in the past month.
    const products = await InventoryProduct.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for the previous month' });
    }

    // Company details – change these values as per your configuration.
    const companyInfo = {
      gstin: "COMPANY_GSTIN", // Replace with your company GSTIN
      legalName: "Your Company Legal Name",
      tradeName: "Your Company Trade Name"
    };

    // Compute Aggregate Turnover from the product invoice values (here we use "mrp").
    const aggregateTurnover = products.reduce((acc, prod) => acc + prod.mrp, 0);

    // --------------------------
    // Table 4: Taxable outward supplies made to registered persons (excluding supplies via e‑commerce etc.)
    // --------------------------
    // Group products by supplierGSTIN.
    const table4Groups = {};
    products.forEach(prod => {
      if (prod.supplierGSTIN) {
        if (!table4Groups[prod.supplierGSTIN]) {
          table4Groups[prod.supplierGSTIN] = [];
        }
        table4Groups[prod.supplierGSTIN].push(prod);
      }
    });
    const table4 = Object.keys(table4Groups).map(supplierGSTIN => {
      const invDetails = table4Groups[supplierGSTIN].map(prod => {
        // Use invoiceDate if available; otherwise, fall back to createdAt.
        const invoiceDate = prod.invoiceDate ? moment(prod.invoiceDate) : moment(prod.createdAt);

        // Calculate taxes.
        const taxableValue = prod.costPrice; // Assuming costPrice is the taxable amount
        let cgst = 0, sgst = 0, igst = 0;
        if (prod.isInterState) {
          igst = taxableValue * prod.igstRate;
        } else {
          cgst = taxableValue * prod.cgstRate;
          sgst = taxableValue * prod.sgstRate;
        }

        return {
          invoiceNumber: prod.invoiceNo || `INV_${prod.productId}`,
          invoiceDate: invoiceDate.format("DD-MM-YYYY"),
          invoiceValue: prod.mrp,
          taxableValue: taxableValue,
          integratedTax: igst,
          centralTax: cgst,
          stateUtTax: sgst,
          cess: 0,
          // For "Place of Supply", we take the first two characters of the supplier GSTIN (if available)
          placeOfSupply: prod.supplierGSTIN ? prod.supplierGSTIN.substring(0, 2) : "00"
        };
      });

      return {
        supplierGSTIN,
        invoiceDetails: invDetails
      };
    });

    // --------------------------
    // Table 7: Taxable supplies to unregistered persons (if any).
    // --------------------------
    const table7 = products.filter(prod => !prod.supplierGSTIN).map(prod => {
      const invoiceDate = prod.invoiceDate ? moment(prod.invoiceDate) : moment(prod.createdAt);
      const taxableValue = prod.costPrice;
      let cgst = 0, sgst = 0, igst = 0;
      if (prod.isInterState) {
        igst = taxableValue * prod.igstRate;
      } else {
        cgst = taxableValue * prod.cgstRate;
        sgst = taxableValue * prod.sgstRate;
      }
      return {
        invoiceNumber: prod.invoiceNo || `INV_${prod.productId}`,
        invoiceDate: invoiceDate.format("DD-MM-YYYY"),
        invoiceValue: prod.mrp,
        taxableValue: taxableValue,
        integratedTax: igst,
        centralTax: cgst,
        stateUtTax: sgst,
        cess: 0,
        placeOfSupply: "NA"
      };
    });

    // --------------------------
    // Table 12: HSN-wise summary of outward supplies.
    // --------------------------
    const hsnSummary = {};
    products.forEach(prod => {
      if (prod.hsnCode) {
        if (!hsnSummary[prod.hsnCode]) {
          hsnSummary[prod.hsnCode] = {
            description: prod.name,
            uqc: prod.uom,
            totalQuantity: 0,
            totalValue: 0,
            totalTaxableValue: 0,
            totalIntegratedTax: 0,
            totalCentralTax: 0,
            totalStateUtTax: 0,
            totalCess: 0
          };
        }
        const taxableValue = prod.costPrice;
        let cgst = 0, sgst = 0, igst = 0;
        if (prod.isInterState) {
          igst = taxableValue * prod.igstRate;
        } else {
          cgst = taxableValue * prod.cgstRate;
          sgst = taxableValue * prod.sgstRate;
        }

        hsnSummary[prod.hsnCode].totalQuantity += prod.quantity;
        hsnSummary[prod.hsnCode].totalValue += prod.mrp * prod.quantity;
        hsnSummary[prod.hsnCode].totalTaxableValue += taxableValue * prod.quantity;
        hsnSummary[prod.hsnCode].totalIntegratedTax += igst * prod.quantity;
        hsnSummary[prod.hsnCode].totalCentralTax += cgst * prod.quantity;
        hsnSummary[prod.hsnCode].totalStateUtTax += sgst * prod.quantity;
      }
    });
    const table12 = Object.keys(hsnSummary).map(hsnCode => {
      return {
        hsnCode,
        description: hsnSummary[hsnCode].description,
        uqc: hsnSummary[hsnCode].uqc,
        totalQuantity: hsnSummary[hsnCode].totalQuantity,
        totalValue: hsnSummary[hsnCode].totalValue,
        totalTaxableValue: hsnSummary[hsnCode].totalTaxableValue,
        totalIntegratedTax: hsnSummary[hsnCode].totalIntegratedTax,
        totalCentralTax: hsnSummary[hsnCode].totalCentralTax,
        totalStateUtTax: hsnSummary[hsnCode].totalStateUtTax,
        totalCess: hsnSummary[hsnCode].totalCess
      };
    });

    // --------------------------
    // Assemble the final GSTR-1 JSON object.
    // --------------------------
    const filingPeriod = moment(startDate).format("MMYYYY");
    const gstr1 = {
      form: "GSTR-1",
      year: moment(startDate).format("YYYY"),
      month: moment(startDate).format("MMMM"),
      company: companyInfo,
      filingPeriod: filingPeriod,
      aggregateTurnover: aggregateTurnover,
      // Section 4: Taxable outward supplies to registered persons
      table4: table4,
      // Section 7: Taxable supplies to unregistered persons
      table7: table7,
      // Section 12: HSN-wise summary of outward supplies
      table12: table12
      // You can add additional sections (e.g., Tables 4A, 4B, 5, etc.) as needed.
    };

    return res.status(200).json({ message: "GSTR-1 generated successfully", data: gstr1 });
  } catch (err) {
    console.error("Error generating GSTR-1: ", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
