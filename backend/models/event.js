const mongoose = require('mongoose');
const app = require('../app');
const eventSchema =  mongoose.Schema({
    name: String,
    price:String,
    description: String,
    date: Date,
    teacherId: String


  });

const Event =  mongoose.model('Event',eventSchema);

module.exports = Event;