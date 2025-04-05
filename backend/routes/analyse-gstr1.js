const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `You are a financial assistant specialized in GST (Goods and Services Tax) compliance.
You will be given a JSON containing GSTR-1 data.
Return ONLY a JSON with the following structure, and no other explanation or text:

{
  "summary": {
    "totalInvoices": number,
    "totalTaxableValue": number,
    "totalIGST": number,
    "totalCGST": number,
    "totalSGST": number,
    "totalInvoiceValue": number
  },
  "risks": [
    {
      "issue": "string",
      "invoiceNumber": "string",
      "reason": "string"
    }
  ],
  "suggestions": [
    "string"
  ],
  "flags": [
    {
      "type": "string",
      "description": "string",
      "severity": "Low | Medium | High"
    }
  ]
}

Make sure your response is valid JSON and matches this structure strictly.`
});

const generationConfig = {
  temperature: 0.7,
  topP: 1,
  topK: 40,
  maxOutputTokens: 4096
};

// Formatter function to convert GSTR1 data to AI-friendly structure
function formatForAnalysis(gstr1Data) {
  const b2b = gstr1Data.table4.flatMap(entry =>
    entry.invoiceDetails.map(inv => ({
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: inv.invoiceDate,
      invoiceValue: inv.invoiceValue,
      taxableValue: inv.taxableValue,
      cgst: inv.centralTax,
      sgst: inv.stateUtTax,
      igst: inv.integratedTax,
      placeOfSupply: inv.placeOfSupply,
      receiverGSTIN: entry.supplierGSTIN
    }))
  );

  const b2cs = gstr1Data.table7.map(inv => ({
    invoiceNumber: inv.invoiceNumber,
    invoiceDate: inv.invoiceDate,
    invoiceValue: inv.invoiceValue,
    taxableValue: inv.taxableValue,
    cgst: inv.centralTax,
    sgst: inv.stateUtTax,
    igst: inv.integratedTax,
    placeOfSupply: inv.placeOfSupply
  }));

  const summary = {
    totalInvoices: b2b.length + b2cs.length,
    totalTaxableValue: b2b.reduce((a, b) => a + b.taxableValue, 0) + b2cs.reduce((a, b) => a + b.taxableValue, 0),
    totalIGST: b2b.reduce((a, b) => a + b.igst, 0) + b2cs.reduce((a, b) => a + b.igst, 0),
    totalCGST: b2b.reduce((a, b) => a + b.cgst, 0) + b2cs.reduce((a, b) => a + b.cgst, 0),
    totalSGST: b2b.reduce((a, b) => a + b.sgst, 0) + b2cs.reduce((a, b) => a + b.sgst, 0),
    totalInvoiceValue: b2b.reduce((a, b) => a + b.invoiceValue, 0) + b2cs.reduce((a, b) => a + b.invoiceValue, 0)
  };

  return {
    gstin: gstr1Data.company.gstin,
    returnPeriod: gstr1Data.filingPeriod,
    summary,
    b2b,
    b2cs,
    complianceFlags: {
      gstMismatch: false,
      missingInvoices: false
    }
  };
}

router.post('/analyse-gstr1', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Missing GSTR-1 data in request body.' });
    }

    const formatted = formatForAnalysis(data);

    const chatSession = model.startChat({
      generationConfig,
      history: []
    });

    const prompt = `
Analyze the following GSTR-1 JSON and return ONLY a JSON output in the required format:
\`\`\`json
${JSON.stringify(formatted, null, 2)}
\`\`\`
`;

    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();

    res.json({
      message: 'GSTR-1 analysis generated successfully',
      analysis: text
    });

  } catch (error) {
    console.error('Error analyzing GSTR-1:', error);
    res.status(500).json({ error: 'Failed to analyze GSTR-1' });
  }
});

module.exports = router;
