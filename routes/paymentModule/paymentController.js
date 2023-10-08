const { default: axios } = require("axios");
const dotenv = require("dotenv");

const authOnly = async (req, res) => {
  const payload = {
    ...req.body,
    xKey: process.env.CARDKNOX_API_KEY,
    xCommand: "cc:AuthOnly",
    xVersion: "5.0.0",
    xSoftwareName: "Loft",
    xSoftwareVersion: "1.0.0",
  };

  const cardKnoxResponse = await axios.post(
    process.env.CARDKNOX_API_URL,
    payload
  );

  const response = {
    message: cardKnoxResponse.data.xStatus,
    data: cardKnoxResponse.data,
  };

  if (cardKnoxResponse.data.xResult === "A") {
    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }
};
const capturePayment = async (req, res) => {
  const payload = {
    ...req.body,
    xKey: process.env.CARDKNOX_API_KEY,
    xCommand: "cc:Capture",
    xVersion: "5.0.0",
    xSoftwareName: "Loft",
    xSoftwareVersion: "1.0.0",
  };
  const cardAPIResponse = await axios.post(
    process.env.CARDKNOX_API_URL,
    payload
  );

  const response = {
    message: cardAPIResponse.data.xStatus,
    data: cardAPIResponse.data,
  };

  if (cardAPIResponse.data.xResult === "A") {
    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }
};

module.exports = {
  authOnly,
  capturePayment,
};
