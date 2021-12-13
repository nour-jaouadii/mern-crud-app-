// import express module
const express = require("express");
// import Multer module
const multer = require("multer");
const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    let error = new Error("Mime type is invalid");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE[file.mimetype];
    const imgName = name + "-" + Date.now() + "-crococoder-" + "." + extension;
    cb(null, imgName);
  },
});
// import Course Models
const Course = require("../models/course");

const router = express.Router();

// Business logic to  Add course to
router.post("/", multer({ storage: storage }).single("img"), (req, res) => {
  console.log(req.body, ` here into adding course`);
  url = req.protocol + "://" + req.get("host");

  // connect to db
 // img: "path/to/file/into/server",
  const Course1 = new Course({
    teacher: req.body.teacher,
    name: req.body.name, 
    price: req.body.price,
    description: req.body.description,
    img: url + "/images/" + req.file.filename,
  });
  Course1.save()
    .then((response) => {
      console.log("adding Course with success");
      res.status(200).json({
        message: "Course added successFuly",
        course: response,
      });
    })
    .catch((error) => {
      console.log("error with data ", error);
    });
});
// Business Logic to get  all courses
router.get("/", (req, res) => {
  console.log("here into get all courses");
  Course.find((error, docs) => {
    if (error) {
      console.log("Error with db");
    } else {
      // Res : Array OF Object
      res.status(200).json({
        courses: docs,
      });
    }
  });
});

// Business Logic to get course by ID

router.get("/:id", (req, res) => {
  console.log("Here into get course By Id ", req.params.id);
  Course.findOne({ _id: req.params.id }).then((result) => {
    console.log("Here result after find by id", result);
    res.status(200).json({
      findedCourse: result,
    });
  });
});

//Business logic : Delete course by ID
router.delete("/:id", (req, res) => {
  console.log("Here into delete Course", req.params.id);
  Course.deleteOne({ _id: req.params.id }).then((result) => {
    console.log("Here result after delete", result);
    if (result.n == 1) {
      Course.find().then((courses) => {
        res.status(200).json({
          courses: courses,
          message: `Course  ID ${req.params.id}  is deleted successfully`,
        });
      });
    } else {
      res.status(200).json({
        message: `Course  ID ${req.params.id}  does not exist`,
      });
    }
  });
});

//  Bl to update course by IS
router.put("/:id", (req, res) => {
  console.log("Here into edit course By Id ", req.params.id);

  Course.updateOne({ _id: req.params.id }, req.body)
    .then((result) => {
      console.log(result);
      if (result.n == 1) {
        console.log("Here result after find by id", result);
        res.status(200).json({
          message: "Course Updated successFuly",
          course: result,
        });
      } else {
        res.status(200).json({
          message: "Course Does not exist ",
          course: result,
        });
      }
    })
    .catch((error) => {
      console.log("error with data ", error, "not found ID");
      res.status(200).json({
        message: "not found ID",
        course: error,
      });
    });
  //  );  // end Update one
}); //  end function

module.exports = router;
