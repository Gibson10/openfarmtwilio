'use strict';
/**
 * User Model
 **/
var passportLocalMongoose = require('passport-local-mongoose'),
	mongoose = require('mongoose');

 var usersSchema = new mongoose.Schema({
  fullName    : String,
  email       : {
    type      : String,
    lowercase : true
  },
  password    : String,
  access_token: String,
  alreadyExist: String,
  otp : Number,
  otpCreatedTime:Date,
  isVerified  : {
    type : Boolean,
    default : false
  },
  isDeleted   : {type : Boolean, default: false},
  createdAt   : {
    type      : Date,
    default   : Date.now()
  },
  updatedAt   :  {
    type      : Date,
    default   : Date.now()
  },

  username:String,

});

usersSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', usersSchema);