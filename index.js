const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require("./src/routes/auth");
const bookings = require("./src/routes/bookings");
const gallery = require("./src/routes/gallery");
const amenities = require("./src/routes/amenities");
const galleryCategory = require("./src/routes/galleryCategory");
const users = require("./src/routes/users");
const complaints = require("./src/routes/complaints");
const contactUs = require("./src/routes/contactUs");
const testimonials = require("./src/routes/testimonials");
const property = require("./src/routes/property");
const blog = require("./src/routes/blog");
const newAuth = require("./src/routes/AuthModule/authRoute");
const floorRoute = require("./src/routes/floors");
const flatRoute = require("./src/routes/flat");
const minimumStayRoute = require("./src/routes/minimumStay");
const unitTypes = require("./src/routes/unitType");
const maintenanceRoute = require("./src/routes/maintenance");
const availabilityRoute = require("./src/routes/flatModule/flatRoute");
const paymentRoute = require("./src/routes/paymentModule/paymentRoute")
const fileRoute = require("./src/routes/upload")

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// app.use(express.json());
app.use(cors());
// app.use("/api", auth);
app.use("/api", bookings);
app.use("/api", gallery);
app.use("/api", amenities);
app.use("/api", galleryCategory);
app.use("/api", users);
app.use("/api", complaints);
app.use("/api", contactUs);
app.use("/api", testimonials);
app.use("/api", property);
app.use("/api", blog);
app.use("/api", newAuth);
app.use("/api", floorRoute);
app.use("/api", flatRoute);
app.use("/api", minimumStayRoute);
app.use("/api", unitTypes);
app.use("/api", maintenanceRoute);
app.use("/api", availabilityRoute);
app.use("/api", paymentRoute);
app.use("/api", fileRoute);

app.use(cors());
    app.all("/*", (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      // tslint:disable-next-line: max-line-length
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Authorization"
      );
      res.header("Access-Control-Allow-Methods", "*");
      res.header("Access-Control-Request-Headers", "*");
      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
      } else {
        next();
      }
    })


// Start the server
app.listen(8000, () => console.log("Server started on port 8000"));
