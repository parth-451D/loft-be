const bcrypt = require("bcrypt");
const pool = require("../../../dbconfig");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const register = async (req, res) => {
  try {
    // check for duplicate
    const [duplicateRows] = await pool.execute(
      "SELECT * from users_table where email = ? or mobile = ?",
      [req.body.email, req.body.mobile]
    );
    if (duplicateRows.length > 0) {
      return res
        .status(400)
        .json({ messagge: "User already exist..." });
    }
    const hashPass = await bcrypt.hash(req.body.password, 10);
    const query =
      "INSERT INTO users_table (name, email, mobile ,password) VALUES (?, ?, ? ,?) ";
    const paramsArr = [
      req.body.name,
      req.body.email,
      req.body.mobile,
      hashPass,
    ];
    const [resultRow] = await pool.execute(query, paramsArr);
    if (resultRow.affectedRows === 1) {
      res.status(200).json({ message: "User registered successfully..." });
    }
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    //get use with email address
    const [userRaw] = await pool.execute(
      "SELECT * from users_table where email = ?",
      [req.body.email]
    );
    console.log("users details", userRaw[0]);
    if (userRaw.length > 0) {
      // check email and password in the database
      const isMatch = await bcrypt.compare(
        req.body.password,
        userRaw[0].password
      );
      if (isMatch && userRaw[0].email === req.body.email) {
        const token = jwt.sign(
          {
            id: userRaw[0].id,
            name: userRaw[0].name,
            email: userRaw[0].email,
          },
          process.env.JWT_SECRET_KEY
        );
        res.status(200).json({ message: "Successfully Login", token: token });
      } else {
        res.status(400).json({ message: "Wrong Password" });
      }
    } else {
      res.status(400).json({ message: "User not registered" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const dataFromToken = async (req, res, next) => {
  const token = req.headers.authorization;
  const verifiedTokenDetails = jwt.verify(
    token ? token : "",
    `${process.env.JWT_SECRET_KEY}`
  );
  if (verifiedTokenDetails) {
    req.authData = verifiedTokenDetails;
    next();
  }
};

const changePassword = async (req, res) => {
  try {
    // check for old password is right for the id
    const [userRaw] = await pool.execute(
      "SELECT * from users_table where id = ?",
      [req.authData.id]
    );
    console.log(userRaw[0]);
    if (userRaw.length > 0) {
      // check for current password with database password
      const match = await bcrypt.compare(
        req.body.old_password,
        userRaw[0].password
      );
      if (match) {
        const hashPass = await bcrypt.hash(req.body.new_password, 10);
        const [updateRaw] = await pool.execute(
          "UPDATE users_table SET password = ? WHERE id = ? ",
          [hashPass, req.authData.id]
        );
        if (updateRaw.affectedRows === 1) {
          res.status(200).json({ message: "Password changed successfully..." });
        }
      } else {
        res.status(400).json({ message: "Current password is incorrect!!" });
      }
    } else {
      res.status(400).json({ message: "User not exist" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login, changePassword, dataFromToken };
