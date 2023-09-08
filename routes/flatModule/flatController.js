const bcrypt = require("bcrypt");
const pool = require("../../dbconfig");
const dotenv = require("dotenv");
const moment = require("moment/moment");
dotenv.config();

const checkForMinimunStay = async (req, res, next) => {
  try {
    // check for start date in between minimum stay request
    const [rows, field] = await pool.execute(
      "SELECT * FROM minimum_stay WHERE ? BETWEEN start_date AND end_date;",
      [req.body.start_date]
    );
    console.log("rows", rows.length);
    if (rows.length > 0) {
      // now check for days of that range
      const startDate = moment(req.body.start_date);
      const endDate = moment(req.body.end_date);
      const numberOfDaysRequested = endDate.diff(startDate, "days");

      //   compare with found minimum stay days
      if (numberOfDaysRequested >= rows[0].selected_days) {
        req.minimumPrice = {
            1 : rows[0].category_1,
            2 : rows[0].category_2,
            3 : rows[0].category_3,
            4 : rows[0].category_4,
            5 : rows[0].category_5,
        }
        next();
      } else {
        return res.send({
          message: `Number of days requested is less then minimum stay days, Kindly select more then ${
            rows[0].selected_days - 1
          } days`,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { checkForMinimunStay };
