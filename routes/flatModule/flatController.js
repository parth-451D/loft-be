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
          1: rows[0].category_1,
          2: rows[0].category_2,
          3: rows[0].category_3,
          4: rows[0].category_4,
          5: rows[0].category_5,
        };
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

const checkForAvailableFloor = async (req, res, next) => {
  // const [bookedRows, bookedFields] = await pool.query(
  //   "SELECT unitNo FROM temp_booking WHERE ? BETWEEN start_date AND end_date;",
  //   [req.body.start_date]
  // );
  // const bookedFlats = bookedRows.map((ele) => {
  //   return ele.unitNo;
  // });
  // const flatArray = [
  //   [101, 102, 103, 104, 105, 106, 107, 108],
  //   [201, 202, 203, 204, 205, 206, 207, 208],
  //   [301, 302, 303, 304, 305, 306, 307, 308],
  // ];
  // const filteredFlatArray = flatArray.map((subArray) =>
  //   subArray.filter((flat) => !bookedFlats.includes(flat))
  // );

  const [maintenanceRows, maintenanceFields] = await pool.query(
    "SELECT flats.unitNo as unitNo from maintenance join flats on maintenance.flatId = flats.id where ? BETWEEN start_date AND end_date;",
    [req.body.start_date]
  );

  console.log("maintenanceRows", maintenanceRows);
};

module.exports = { checkForMinimunStay, checkForAvailableFloor };
