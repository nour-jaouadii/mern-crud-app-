const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

mongoose.connect("mongodb://localhost:27017/ReactCourseDB");

const bodyParser = require("body-parser");

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();


// create express application
const app = express();
// for parsing application/json
app.use(express.json()) ;
// app.use(express.urlencoded({ extended: false }));


// for parsing cookies
app.use(cookieParser());



// configure bodyParser to parse  req body
app.use(bodyParser.urlencoded({ extended: true }));
// configure bodyParser to send json response
app.use(bodyParser.json());
// import multer module
// import multer path
const path = require('path');

app.use('/images', express.static(path.join('backend/images')));




// define routes
const eventRoutes = require("./routes/event-routes");
const courseRoutes = require("./routes/course-routes");
const userRoutes = require("./routes/user-routes");

// app.get("/api/weather", (req, res) => {
//   const country = req.body.country;
//   const apiKey = "62ee756a34835483299877a61961cafb";
//   const apiUrl =
//     "https://api.openweathermap.org/data/2.5/weather?q=" +
//     country +
//     "&appid=" +
//     apiKey +
//     "&units=metric";
//   axios.get(apiUrl).then((response) => {
//     console.log("Here response", response);
//     const weather = response.data.main;
//     console.log("Here weather main", weather);
//     const result = {
//       temppp: weather.temp,
//       pressure: weather.pressure,
//       humidity: weather.humidity,
//       icon: response.data.weather[0].icon,
//     };
//     res.status(200).json({
//       result: result,
//     });
//   });
// });


// security configuration
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Origin, Accept, Content-Type, X-Requested-with"
//   );
//   res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, DELETE, OPTIONS, PATCH, PUT"
//   );
//   next();
// });

//configure cors

app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);


//configure routes

app.use("/api/events", eventRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
//has to be the last line !
module.exports = app;
