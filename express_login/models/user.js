const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: {
    type: String,
    minlength: 8,
    //$regex: /^(?=.*[A-Z])(?=.*[0-9]).*$/
  },
  // passwordConfirm: {
  //   type: String,
  //   minlength: 8
  // },
  firstName: String,
  surname: String,
  birthDate: Date
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;