const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require("./routes/auth");
const bookings = require("./routes/bookings");
const gallery = require("./routes/gallery");
const amenities = require("./routes/amenities");
const galleryCategory = require("./routes/galleryCategory");
const users = require("./routes/users");
const complaints = require("./routes/complaints");
const contactUs = require("./routes/contactUs");
const testimonials = require("./routes/testimonials");
const property = require("./routes/property");
const blog = require("./routes/blog");
const newAuth = require("./routes/AuthModule/authRoute");
const floorRoute = require("./routes/floors");
const flatRoute = require("./routes/flat");
const minimumStayRoute = require("./routes/minimumStay")
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

// Start the server
app.listen(8000, () => console.log("Server started on port 8000"));
