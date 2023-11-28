const { default: axios } = require("axios");
const dotenv = require("dotenv");
const { pool } = require("../../../dbconfig");

const authOnly = async (req, res) => {
  let cardKnoxResponse ;
  try {
    const payload = {
      xCardNum: req.body.xCardNum,
      xExp: req.body.xExp,
      xCvv: req.body.xCvv,
      xAmount: req.body.xAmount,
      xKey: process.env.CARDKNOX_API_KEY,
      xCommand: "cc:AuthOnly",
      xVersion: "5.0.0",
      xSoftwareName: "Loft",
      xSoftwareVersion: "1.0.0",
    };

    cardKnoxResponse = await axios.post(
      process.env.CARDKNOX_API_URL,
      payload
    );

    const [addPaymentDetailsToTable, fields] = await new Promise(
      (resolve, reject) => {
        pool.query(
          "insert into payment_history (userId, xRefNum, status) values (?,?,?)",
          [
            req.body.userId,
            cardKnoxResponse.data.xRefNum,
            cardKnoxResponse.data.xStatus,
          ],
          (error, results, fields) => {
            if (error) {
              reject(error);
            } else {
              resolve([results, fields]);
            }
          }
        );
      }
    );

    // const buffer = Buffer.from(req.body.idProof, "base64");
    if (cardKnoxResponse.data.xResult === "A") {
      const [rows, fields] = await new Promise((resolve, reject) => {
        pool.query(
          "insert into requested_bookings (unitNo, floorNo, userId, fullName, mobileNumber, reason, emailId, paymentId, status,startDate, endDate, pricePerDay, deposit, cleaningFees, idProof, userXrefNum) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            req.body.unitNo,
            req.body.floorNo,
            req.body.userId,
            req.body.fullName,
            req.body.mobileNumber,
            req.body.reason,
            req.body.emailId,
            addPaymentDetailsToTable.insertId,
            "Requested",
            req.body.startDate,
            req.body.endDate,
            req.body.pricePerDay,
            req.body.deposit,
            req.body.cleaningFees,
            req.body.idProof,
            cardKnoxResponse.data.xRefNum,
          ],
          (error, results, fields) => {
            if (error) {
              reject(error);
            } else {
              resolve([results, fields]);
            }
          }
        );
      });
      const emailOptions = {
        to: process.env.ADMIN_EMAIL,
        subject:
          "New Request for Booking",
        template: "newBooking",
        context: {
          "{link}": `${process.env.FRONT_URL}/admin/paymentRequest`,
        },
      };
      console.log("object", rows, fields);
      return res.status(200).json({
        message:
          "You booked flat successfully, Note this Reference number for your transaction.",
        xRefNum: cardKnoxResponse.data.xRefNum,
      });
    } else {
      return res.status(400).json({
        message: cardKnoxResponse.data.xError,
        data: cardKnoxResponse.data,
      });
    }
  } catch (error) {
    if (cardKnoxResponse?.data?.xResult === "A") {
      const payload = {
        xRefNum: cardAPIResponse.data.xRefNum,
        xKey: process.env.CARDKNOX_API_KEY,
        xCommand: "cc:Void",
        xVersion: "5.0.0",
        xSoftwareName: "Loft",
        xSoftwareVersion: "1.0.0",
      };
      const cardAPIResponse = await axios.post(
        process.env.CARDKNOX_API_URL,
        payload
      );
    }
    return res.status(404).json({ message: error.message });
  }
};

const capturePayment = async (req, res) => {
  try {
    const payload = {
      xRefNum: req.body.xRefNum,
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

    console.log("cardA", cardAPIResponse);

    if (cardAPIResponse.data.xResult === "A") {
      const [rows, fields] = await new Promise((resolve, reject) => {
        pool.query(
          "update requested_bookings set status = 'Approved', adminXrefNum = ? where id = ?",
          [cardAPIResponse.data.xRefNum, req.body.bookingId],
          (error, results, fields) => {
            if (error) {
              reject(error);
            } else {
              resolve([results, fields]);
            }
          }
        );
      });
      if (rows.affectedRows === 1) {
        // send email here
        return res.status(200).json({
          data: cardAPIResponse.data,
          message: "The booking has been confirmed",
        });
      } else {
        return res.stauts(400).json({
          data: cardAPIResponse.data,
          message: "Internal Server Error",
        });
      }
    } else {
      res.status(400).json({
        data: cardAPIResponse.data,
        message: cardAPIResponse.data.xError,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const releasePayment = async (req, res) => {
  try {
    const payload = {
      xRefNum: req.body.xRefNum,
      xKey: process.env.CARDKNOX_API_KEY,
      xCommand: "cc:Void",
      xVersion: "5.0.0",
      xSoftwareName: "Loft",
      xSoftwareVersion: "1.0.0",
    };
    const cardAPIResponse = await axios.post(
      process.env.CARDKNOX_API_URL,
      payload
    );

    if (cardAPIResponse.data.xResult === "A") {
      const [rows, fields] = await new Promise((resolve, reject) => {
        pool.query(
          "update requested_bookings set status = 'Rejected', adminXrefNum =? where id =?",
          [cardAPIResponse.data.xRefNum, req.body.bookingId],
          (error, results, fields) => {
            if (error) {
              reject(error);
            } else {
              resolve([results, fields]);
            }
          }
        );
      });
      if (rows.affectedRows === 1) {
        // send email here
        return res.status(200).json({
          data: cardAPIResponse.data,
          message: "The booking has been rejected",
        });
      } else {
        return res.stauts(400).json({
          data: cardAPIResponse.data,
          message: "Internal Server Error",
        });
      }
    } else {
      res.status(400).json({
        data: cardAPIResponse.data,
        message: cardAPIResponse.data.xError,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const depositRefund = async (req, res) => {
  try {
    const payload = {
      xRefNum: req.body.xRefNum,
      xAmount: req.body.xAmount,
      xKey: process.env.CARDKNOX_API_KEY,
      xCommand: "cc:Refund",
      xVersion: "5.0.0",
      xSoftwareName: "Loft",
      xSoftwareVersion: "1.0.0",
    };

    const cardAPIResponse = await axios.post(
      process.env.CARDKNOX_API_URL,
      payload
    );

    console.log("cardAPIResponse0", cardAPIResponse.data);

    if (cardAPIResponse.data.xResult === "A") {
      const [rows, fields] = await new Promise((resolve, reject) => {
        pool.query(
          "update requested_bookings set isDepositRefunded = 1, refundXrefNum = ? where id =?",
          [cardAPIResponse.data.xRefNum, req.body.bookingId],
          (error, results, fields) => {
            if (error) {
              reject(error);
            } else {
              resolve([results, fields]);
            }
          }
        );
      });
      if (rows.affectedRows === 1) {
        // send email here
        return res.status(200).json({
          data: cardAPIResponse.data,
          message: "Deposit refunded successfully to user's account.",
        });
      } else {
        return res.stauts(400).json({
          data: cardAPIResponse.data,
          message: "Internal Server Error",
        });
      }
    } else {
      return res.status(400).json({
        data: cardAPIResponse.data,
        message: cardAPIResponse.data.xError,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const [rows, fields] = await new Promise((resolve, reject) => {
      pool.query(
        "SELECT requested_bookings.id, requested_bookings.unitNo, userXrefNum, status  FROM requested_bookings LEFT JOIN flats ON flats.id = requested_bookings.unitNo WHERE userId = ?",
        [userId],
        (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve([results, fields]);
          }
        }
      );
    });
    return res
      .status(200)
      .json({ data: rows, message: "Fetched user bookings successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getBookingsByStatus = async (req, res) => {
  try {
    const status = req.query.status;
    const [rows, fields] = await new Promise((resolve, reject) => {
      pool.query(
        "SELECT requested_bookings.id, flats.unitNo as unitNo, userXrefNum, status, fullName, startDate, endDate, pricePerDay, requested_bookings.deposit, requested_bookings.cleaningFees, isDepositRefunded, refundXrefNum, adminXrefNum FROM requested_bookings LEFT JOIN flats ON flats.id = requested_bookings.unitNo WHERE status = ?",
        [status],
        (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve([results, fields]);
          }
        }
      );
    });
    return res
      .status(200)
      .json({ data: rows, message: "Fetched Flats successfully" });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  authOnly,
  capturePayment,
  releasePayment,
  depositRefund,
  getUserBookings,
  getBookingsByStatus,
};
