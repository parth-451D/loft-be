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

// const checkForAvailableFloor = async (req, res, next) => {
//   const [bookedRows, bookedFields] = await pool.query(
//     "SELECT unitNo FROM temp_booking WHERE ? BETWEEN start_date AND end_date;",
//     [req.body.start_date]
//   );
//   const bookedFlats = bookedRows.map((ele) => {
//     return ele.unitNo;
//   });
//   const flatArray = [
//     [101, 102, 103, 104, 105, 106, 107, 108],
//     [201, 202, 203, 204, 205, 206, 207, 208],
//     [301, 302, 303, 304, 305, 306, 307, 308],
//   ];
//   const filteredFlatArray = flatArray.map((subArray) =>
//     subArray.filter((flat) => !bookedFlats.includes(flat))
//   );
//   const [maintenanceRows, maintenanceFields] = await pool.query(
//     "SELECT * from maintenance join flats on maintenance.flatId = flats.id where ? BETWEEN start_date AND end_date;",
//     [req.body.start_date]
//   );
//   const maintenanceFlats = maintenanceRows.map((ele) => {
//     return ele.unitNo;
//   });
//   const finalArray = filteredFlatArray.map((subArray) => {
//     return subArray.filter((flat) => {
//       return !maintenanceFlats.includes(flat);
//     });
//   });

//   let response = [
//     { floor: 1, clickable: true },
//     { floor: 2, clickable: true },
//     { floor: 3, clickable: true },
//   ];

//   finalArray.map((ele, idx) => {
//     if (ele.length > 0) {
//       response[idx].clickable = false;
//     }
//   });
//   const matchingObjects = [];
//   if(req.body.bathroom ){
//     finalArray.forEach((subArray) => {
//       subArray.forEach((unitNo) => {
//         console.log(unitNo,"ssss");
//         const matchingObject = maintenanceRows.find((obj) => obj.unitNo === unitNo);
// console.log(maintenanceRows,"ddddddd")
//         console.log(matchingObject,"match")
//         if (matchingObject && matchingObject.bathrooms >= req.body.bathroom) {
//           console.log("bathroom inp",req.body.bathroom)
//           matchingObjects.push(matchingObject);
//         }
//       });
//     });
//   }

//   console.log(matchingObjects,"match")

// };

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
  // const [allFlatsRows, allFlatsFields] = await pool.query(
  //   "SELECT temp_booking.*, flats.bathrooms, flats.beds from temp_booking join flats on flats.unitNo = temp_booking.unitNo"
  // );

  // console.log("allFlatsRows", allFlatsRows);
  console.log("filteredFlatArray", filteredFlatArray);

  // const filteredFlatArrayWithCriteria = filteredFlatArray.map(async(subArray) =>
  //   subArray.filter(async (unitNo) => {
  //     const [flatRow, flatField] = await pool.query(
  //       "select * from flats where unitNo = ?", [unitNo]
  //     )
  //     // Find the matching maintenance object for the unitNo
  //     // const matchingMaintenanceObject = allFlatsRows.find((obj) => {
  //     //   console.log("object", obj);
  //     //   return obj.unitNo === unitNo
  //     // });
  //     // console.log("flatRow", flatRow)
  //     console.log("bathrooms", flatRow[0].bathrooms);
  //     console.log("beds", flatRow[0].beds)
  //     return (flatRow[0].bathrooms >= +req.body.bathrooms && flatRow[0].beds >= +req.body.beds)
  //     // console.log("matchingMaintenanceObject", matchingMaintenanceObject)
  //     // // Check if the unit meets the criteria
  //     // return (
  //     //   matchingMaintenanceObject &&
  //     //   matchingMaintenanceObject.bathrooms >= req.body.bathrooms &&
  //     //   matchingMaintenanceObject.beds >= req.body.bedrooms
  //     // );
  //   })
  // );

  const filteredFlatArrayWithCriteria = await Promise.all(
    filteredFlatArray.map(async (subArray) => {
      const filteredUnits = await Promise.all(
        subArray.map(async (unitNo) => {
          console.log("unitNo", unitNo);
          const [flatRow, flatField] = await pool.query(
            "SELECT * FROM flats WHERE unitNo = ?",
            [unitNo]
          );
          console.log("Row data", flatRow);
          // Check if the query returned any rows and if the unit meets the criteria
          if (
            flatRow.length > 0 &&
            flatRow[0].bathrooms >= req.body.bathrooms &&
            flatRow[0].beds >= req.body.beds
          ) {
            return unitNo; // Return the unitNo if it meets the criteria
          }
          return null; // Return null if the unit is not found or doesn't meet the criteria
        })
      );

      console.log("filter units", filteredUnits);

      // Remove null values (units that didn't meet the criteria or weren't found)
      return filteredUnits.filter((unitNo) => unitNo !== null);
    })
  );
  console.log("sdfsfsgegdv", filteredFlatArrayWithCriteria);
};

module.exports = { checkForMinimunStay, checkForAvailableFloor };
