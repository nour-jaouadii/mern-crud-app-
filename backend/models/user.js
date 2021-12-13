const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');


const UserSchema = mongoose.Schema({ 
    firstName: String, 
    lastName: String,
     email: {type : String, unique: true },
     username : String,
     pwd: String,
     role: Number
    });
    
    
// UserSchema.plugin(uniqueValidator);

//  Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User',UserSchema );

module.exports = User;
