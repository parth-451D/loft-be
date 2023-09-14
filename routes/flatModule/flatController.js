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
          code: 401,
          message: `Number of days requested is less then minimum stay days, Kindly select more then ${
            rows[0].selected_days - 1
          } days`,
        });
      }
    } next()
  } catch (error) {
    res.status(400).json({ code: 400, message: error.message });
  }
};

const checkForAvailableFloor = async (req, res) => {
  const [bookedRows, bookedFields] = await pool.query(
    "SELECT unitNo FROM temp_booking WHERE ? BETWEEN start_date AND end_date;",
    [req.body.start_date]
  );

  const bookedFlats = bookedRows.map((ele) => {
    return ele.unitNo;
  });
  const [maintenanceRows, maintenanceFields] = await pool.query(
    "SELECT * from maintenance join flats on maintenance.flatId = flats.id where ? BETWEEN start_date AND end_date;",
    [req.body.start_date]
  );
  const maintenanceFlats = maintenanceRows.map((ele) => {
    return ele.unitNo;
  });
  const flatArray = [
    [101, 102, 103, 104, 105, 106, 107, 108],
    [201, 202, 203, 204, 205, 206, 207, 208],
    [301, 302, 303, 304, 305, 306, 307, 308],
  ];
  const notAvailableFlats = [...new Set([...bookedFlats, ...maintenanceFlats])];
  const filteredFlatArray = flatArray.map((subArray) =>
    subArray.filter((flat) => !notAvailableFlats.includes(flat))
  );

  const [flatsWithCriteriaRows, flatsWithCriteriaFields] = await pool.query(
    "select unitNo from flats where bathrooms >= ? and beds >= ?",
    [req.body.bathrooms, req.body.beds]
  );

  const criteriaFlats = flatsWithCriteriaRows.map((ele) => {
    return ele.unitNo;
  });

  const finalArray = filteredFlatArray.map((subarray) =>
    subarray.filter((item) => criteriaFlats.includes(item))
  );
  console.log("final array ", finalArray);
  const response = {
    floor1: finalArray[0].length > 0 ? true : false,
    floor2: finalArray[1].length > 0 ? true : false,
    floor3: finalArray[2].length > 0 ? true : false,
  };

  res.status(200).json({
    code: 200,
    message: "Floor data get successfully",
    data: response,
  });
};

const checkForAvailableFlats = async (req, res) => {
  const [bookedFlatsRows, bookedFlatsFields] = await pool.query(
    "select temp_booking.*,  flats.id, flats.unitNo, flats.floorId, flats.unitType, flats.cleaningFees, flats.description, flats.price, flats.bathrooms, flats.beds, flats.guests from temp_booking join flats on flats.unitNo = temp_booking.unitNo where ? between start_date and end_date and floor = ? ;",
    [req.body.start_date, req.body.floor]
  );
  const [maintenanceRows, maintenanceFields] = await pool.query(
    "select maintenance.*, flats.id, flats.unitNo, flats.floorId, flats.unitType, flats.cleaningFees, flats.description, flats.price, flats.bathrooms, flats.beds, flats.guests from maintenance join flats on flats.id = maintenance.flatId where ? between start_date and end_date and flats.floorId = ?;",
    [req.body.start_date, req.body.floor]
  );
  const [criteriaRows, criteriaFields] = await pool.query(
    "select id, unitNo, floorId, unitType, cleaningFees, description, price, bathrooms, beds, guests from flats where bathrooms >= ? and beds >= ? and floorId = ?;",
    [req.body.bathrooms, req.body.beds, req.body.floor]
  );

  let [floorFlatsRow, floorFlatsFields] = await pool.query(
    "select id, unitNo, floorId, unitType, cleaningFees, description, price, bathrooms, beds, guests from flats where floorId = ?;",
    [req.body.floor]
  );
  const reservedUnitNos = [...maintenanceRows, ...bookedFlatsRows].map(
    (item) => item.unitNo
  );
  let filteredCriteriaRows = criteriaRows.filter(
    (item) => !reservedUnitNos.includes(item.unitNo)
  );
  let updatedCriteriaRows;
  if (req.minimumPrice) {
    updatedCriteriaRows = filteredCriteriaRows.map((item) => {
      const unitType = item.unitType.toString();
      if (req.minimumPrice.hasOwnProperty(unitType)) {
        return {
          ...item,
          newPrice: req.minimumPrice[unitType],
          isClickable: true,
        };
      }
      return item;
    });
    console.log(req.minimumPrice);
  }
  const indexToUpdate = floorFlatsRow.findIndex(
    (item) => item.unitNo === updatedCriteriaRows[0].unitNo
  );
  if (indexToUpdate !== -1) {
    floorFlatsRow[indexToUpdate] = {
      ...floorFlatsRow[indexToUpdate],
      ...updatedCriteriaRows[0],
    };
  }
  console.log(floorFlatsRow, "floorFlatsRow");
  res.status(200).json({
    code: 200,
    message: "Floor data and price get successfully",
    data: floorFlatsRow,
  });
};

const getFlatDetails = async (req, res) => {
  console.log("coming");
  const [rows, fields] = await pool.query(
    "select * from flats where unitNo = ?",
    [req.body.unitNo]
  );
  let responseObj = {};
  if (req.minimumPrice) {
    responseObj = { ...rows[0], newPrice: req.minimumPrice[rows[0].unitType] };
  } else {
    responseObj = rows[0];
  }
  res.status(200).json({
    code: 200,
    message: "Flat Details fetched successfully",
    data: responseObj,
  });
};

module.exports = {
  checkForMinimunStay,
  checkForAvailableFloor,
  checkForAvailableFlats,
  getFlatDetails,
};
