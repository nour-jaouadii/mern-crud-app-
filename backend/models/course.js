const mongoose = require('mongoose');
const app = require('../app');
const courseSchema =  mongoose.Schema({
    teacher: String,
    name: String,
    price:String,
    description: String,
    duration: String,
    img: String

  });

const Course =  mongoose.model('Course',courseSchema);

module.exports = Course;