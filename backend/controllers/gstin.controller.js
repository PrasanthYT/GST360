const fetch = require("node-fetch");

const SANDBOX_API_KEY = 'key_live_u29dZdZZXXknMaaai5iNRBRUIUAf3I2I';
const SANDBOX_API_SECRET = 'secret_live_B0qcPUHnXlv0MT6boz8BgihD2oxYoasR';

exports.getGSTNDetails = async (req, res) => {
// const gstin = "27AACCN0053F1ZW";
const {gstin} = req.body


  try {
    // 1. Authenticate
    const authResponse = await fetch("https://api.sandbox.co.in/authenticate", {
      method: "POST",
      headers: {
        "x-api-key": SANDBOX_API_KEY,
        "x-api-secret": SANDBOX_API_SECRET,
        "x-api-version": "1.0",
      },
    });

    if (!authResponse.ok) {
      const error = await authResponse.json();
      throw new Error(error.message || "Authentication failed");
    }

    const { access_token } = await authResponse.json();

    // 2. Make GSTIN search request
    const gstnResponse = await fetch("https://api.sandbox.co.in/gst/compliance/public/gstin/search", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "x-api-key": SANDBOX_API_KEY,
        "Authorization": access_token,
        "x-api-version": "1.0",
      },
      body: JSON.stringify({
        gstin: gstin
      }),
    });

    if (!gstnResponse.ok) {
      const error = await gstnResponse.json();
      throw new Error(error.message || "GSTIN lookup failed");
    }

    const gstData = await gstnResponse.json();
const gstDetails = gstData.data?.data;


if (!gstDetails) {
  return res.status(422).json({ message: "Invalid GSTIN or No Data Found" });
}

const addressObj = gstDetails.pradr?.addr || gstDetails.adadr?.[0]?.addr || {};

const formattedDetails = {
    gstNumber: gstDetails.gstin || gstin,
    tradeName: gstDetails.tradeNam || "Not Available",
    legalName: gstDetails.lgnm || "Not Available",
    address: {
      bnm: addressObj.bnm || "Not Available",
      st: addressObj.st || "Not Available",
      loc: addressObj.loc || addressObj.locality || "Not Available",
      bno: addressObj.bno || addressObj.flno || "Not Available",
      stcd: addressObj.stcd || addressObj.dst || "Not Available",
      pncd: addressObj.pncd || "Not Available",
    },
    status: gstDetails.sts || "Unknown",
  };
  

    // const result = await gstnResponse.json();
    return res.status(200).json(formattedDetails);

  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ 
      error: err.message || "Internal server error",
      details: err.response?.data // Include additional error details if available
    });
  }
};